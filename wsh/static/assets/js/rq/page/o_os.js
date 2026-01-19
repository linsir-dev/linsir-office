define(['jquery'], function($){

	$(function(){

		$.ajax({
			type: "GET",
			url: "/apis/preq/order-split.json",
			success: function (data) {
				var htm = '';

				$.each(data.list,function(idx,item){
					htm += '<tr><td align="center">'+item.drugSno+'</td><td align="center">'+item.baseName+'</td><td align="center">'+item.dose+'</td><td align="center">'+item.specification+'</td><td align="center">'+item.proManufactor+'</td><td align="center">'+item.quantity+'</td><td align="center">'+item.unitPrice+'</td><td align="center">'+item.singlePrice+'</td><td>'+item.packQuantity+'</td><td>'+item.integerQuantity+'</td><td>'+item.scatteredQuantity+'</td><td>'+item.drugSpecific+'</td><td>'+item.distributeTime+'</td></tr>'
				})

				$('#tableList tbody').append(htm)
			}
		})

	})

})