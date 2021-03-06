var Counterparty = {
	item_list: '',
	item_filter: '',
	API_URL: '/json/counterparty.json',
	RECENT_API_URL: '/json/recent_counterparty.json',
	json_data: '',
	recent_data: '',
	filtered_list: '',

	init: function(){
		this.item_list = $('.list');
		this.item_filter = $('#counterparty-text');
		this.populateList();
		this.addEvents();
	},

	populateList: function(){
		var self = this,
				all_list = self.item_list.find('.all'),
				recent_list = self.item_list.find('.recent');

		$.getJSON(self.API_URL, function(data){
			data.sort(function(a, b){
				if (a.company > b.company) {
			    return 1;
			  }
			  if (a.company < b.company) {
			    return -1;
			  }
			  return 0;
			});
			self.json_data = data;

			$.each(data, function(index, item){
				var gfx_code = item._id.substr(item._id.length - 6).toUpperCase();

				all_list.append('<dd data-item-id="' + item._id + '">' + item.company + ' <span>' + gfx_code +'</span></dd>');
			});
		});

		$.getJSON(self.RECENT_API_URL, function(data){
			data.sort(function(a, b){
				if (a.company > b.company) {
			    return 1;
			  }
			  if (a.company < b.company) {
			    return -1;
			  }
			  return 0;
			});
			self.recent_data = data;

			$.each(data, function(index, item){
				var gfx_code = item._id.substr(item._id.length - 6).toUpperCase();

				recent_list.append('<dd data-item-id="' + item._id + '">' + item.company + ' <span>' + gfx_code +'</span></dd>');
			});
		});
	},

	addEvents: function(){
		var self = this,
				all_list = self.item_list.find('.all'),
				recent_list = self.item_list.find('.recent');

		self.item_list.on('click', function(e){
			var clicked_item,
					item_id;

			clicked_item = ($(e.target).is('dd')) ? $(e.target) : $(e.target).parents('dd');
			item_id = clicked_item.data('item-id');

			self.item_list.find('dd').removeClass('active');
			clicked_item.addClass('active');
			self.item_filter.val($('.active').text());
			$('#counterparty').removeClass('open');
		});

		self.item_filter.on('keyup', function(e){
			var new_data = self.filterData(self.json_data),
					new_recent_data = self.filterData(self.recent_data);

			self.updateList(new_data, all_list);
			self.updateList(new_recent_data, recent_list);
			if (e.keyCode != 38 || e.keyCode != 40) {
				console.log(e);
				console.log('not arrow');
				self.setFilteredList();
			}
		});

		self.item_filter.on('focus', function(){
			if (!$('counterparty').hasClass('open')) {
				self.item_filter.trigger('keyup');
				$('#counterparty').addClass('open');
			}
		});

		$(document.body).on('keyup, keydown', function(e){
			if (e.keyCode == 38 || e.keyCode == 40){
				// self.handleArrows(e.keyCode);
			}
			if (e.keyCode == 13) {
				self.handleSelect();
			}
		});

		$('.close').on('click', function(e){
			e.preventDefault();
			self.item_filter.val('');
			self.item_filter.trigger('keyup');
		});

		$('.arrow').on('click', function(e){
			e.preventDefault();
			if ($('#counterparty').hasClass('open')) {
				$('#counterparty').removeClass('open');
			} else {
				self.item_filter.trigger('focus');
			}
		});
	},

	filterData: function(data) {
		var self = this,
				filtered_data = '';

		filtered_data = data.filter(function(obj){
			if (obj.company.toUpperCase().indexOf(self.item_filter.val().toUpperCase()) > -1) {
				return true;
			} else {
				return false;
			}
		});

		return filtered_data;
	},

	updateList: function(data, list) {
		var self = this;

		list.find('dd').remove();

		$.each(data, function(index, item){
			var item_company = item.company.replace(self.item_filter.val(), '<strong>' + self.item_filter.val() + '</strong>'),
					gfx_code = item._id.substr(item._id.length - 6).toUpperCase();

			list.append('<dd data-item-id="' + item._id + '">' + item_company + ' <span>' + gfx_code + '</span></dd>');
		});
	},

	handleArrows: function(key) {
		var is_list_open = $('#counterparty').hasClass('open'),
				current_item = this.item_list.find('.active');

		if (is_list_open) {
			if (key == 38) {
				if (current_item == this.item_list.find('dd').first('dd')) {
					$('#counterparty').removeClass('open');
				} else {
					current_item.removeClass('active').prev().addClass('active');	
				}
			} else if (key == 40) {
				current_item.removeClass('active').next().addClass('active');
			}
		}
	},

	handleSelect: function() {
		var container = $('#counterparty');

		console.log('enter pressed');
		if (container.hasClass('open')) {
			container.removeClass('open');
		};
		this.item_filter.val($('.active').text());
		// if(this.item_filter.focus()==true) this.item_filter.blur();
	},

	setFilteredList: function() {
		this.filtered_list = this.item_list.find('dd');
		this.filtered_list.removeClass('active');
		this.filtered_list.first().addClass('active');
	}
}

$(function(){
	Counterparty.init();
});