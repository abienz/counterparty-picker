var Counterparty = {
	item_list: '',
	item_filter: '',
	API_URL: '/json/Counterparty.json',
	json_data: '',

	init: function(){
		this.item_list = $('.list dl');
		this.item_filter = $('#counterparty-text');
		this.populateList();
		this.addEvents();
	},

	populateList: function(){
		var self = this;

		$.getJSON(self.API_URL, function(data){
			self.json_data = data;
			$.each(data, function(index, item){
				self.item_list.append('<dd data-item-id="' + item._id + '">' + item.company + '</dd>');
			});
		});
	},

	addEvents: function(){
		var self = this;

		$(document.body).on('click', self.item_list.find('dd'), function(e){
			var clicked_item,
					item_id;

			clicked_item = $(e.target);
			item_id = clicked_item.data('item-id');
			
			self.item_list.find('dd').removeClass('active');
			clicked_item.addClass('active');
		});

		self.item_filter.on('keyup', function(){
			var new_data = self.json_data.filter(function(obj){
				if (obj.title.indexOf(self.item_filter.val()) > -1) {
					return true;
				} else {
					return false;
				};
			});
			self.item_list.empty();
			$.each(new_data, function(index, item){
				var item_title = item.title.replace(self.item_filter.val(), '<span class="text-primary">' + self.item_filter.val() + '</span>');
				self.item_list.append('<a href="#" class="list-group-item" data-item-id="' + item.id + '">' + item_title + '</a>');
			});
		});
	}
}

$(function(){
	Counterparty.init();
});