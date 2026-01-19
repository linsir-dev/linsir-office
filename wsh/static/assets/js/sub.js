$(function(){

	//手动新增
	$('.hand_add').click(function(){
		var $tr ='<tr><td align="center"></td><td align="center"></td><td align="center"><input class="hand_add_ipt form-control form-control-inline" style="width:100%;height:100%;box-sizing:border-box" type="text" placeholder="请输入药品名"></td><td align="center"></td><td align="center"></td><td align="center"></td><td align="center" align="center"></td><td align="center"></td><td align="center"></td></tr>'
		$('.demand_management_tb tr').eq(0).after($tr)
		
		$('.hand_add_ipt').on('input', function(){
			var $top = $(this).offset().top+$(this).outerHeight()
			var $left = $(this).offset().left-($('.hand_add_box').outerWidth()-$(this).outerWidth())/2

			$left = $left<0?0:$left
			//parseFloat($left)<0?0:$left
			$('.hand_add_box').css({'left':$left+'px','top':$top+'px','display':'block'})
		})

		$('.hand_add_ipt').blur(function(){
			$('.hand_add_box').hide();
		})
	})

	//勾选新增
	$('.check_new').click(function(){
		$('.pop').show();
		$("#demand_management_tabtit a").click(function(e){
			e.preventDefault();  
			$(this).tab("show");  
		});
	})

	//关闭弹窗
	$('#close').click(function(){
		$(this).parents('.pop').hide()
	})

	//清除已选
	$('.clear_checked').click(function(){
		$('.demand_management_tb td input:checkbox').attr('checked',false);
	})

	//需求管理反选
	$('.reverse_select').click(function(){
		$(this).parent().parent().find('input[type="checkbox"]').each(function(){
			this.checked = !this.checked;
		})
	})

	//采购订单审批——增加一行
	$('.add_line').click(function(){
		$(this).siblings('table').append('<tr><td><input class="form-control form-control-inline" style="width:100%;height:100%;box-sizing:border-box" type="text"></td><td><input class="form-control form-control-inline" style="width:100%;height:100%;box-sizing:border-box" type="text"></td><td><input class="form-control form-control-inline" style="width:100%;height:100%;box-sizing:border-box" type="text"></td><td><input class="form-control form-control-inline" style="width:100%;height:100%;box-sizing:border-box" type="text"></td><td><input class="form-control form-control-inline" style="width:100%;height:100%;box-sizing:border-box" type="text"></td><td><span class="btn-font fa fa-minus btn_decrease"></span><input class="ipt_small" value="600"><span class="btn-font fa fa-plus btn_increase"></span></td><td><span class="glyphicon glyphicon-trash close2"></span></td></tr>')
	})

	//采购订单审批——删除
	$('.close2').parents('table').on('click','.close2',function(){
		$(this).parent().parent().remove()
	})

	$('.tab_list').on('click','.close2',function(){
		$(this).parent().parent().remove()
	})

	//订单管理-子订单详情查看--全选
	$('.all_check').click(function(){
		$(this).parent().parent().siblings().find('input[type="checkbox"]').attr('checked',true)
	})
		//订单管理-子订单详情查看--全选
	$('.tab_list').on('click', '.all_check',function(){
		$(this).parent().parent().siblings().find('input[type="checkbox"]').attr('checked',true)
	})

	//需求管理-手动输入--月周期弹窗
	$('.pop2_btn').click(function(){
		$('.pop2').show()
	})


	//关闭弹窗
	$('#close2').click(function(){
		$(this).parents('.pop2').hide()
	})

	//需求管理-手动输入--月周期弹窗
	$('.pop3_btn').click(function(){
		$('.pop3').show()
	})

	//关闭弹窗
	$('#close3').click(function(){
		$(this).parents('.pop3').hide()
	})

	//关闭弹窗
	$('#close4').click(function(){
		$(this).parents('.pop').hide()
	})

	$('.btn_decrease').click(function(){
		var $next = $(this).next()
		$next.attr('value',parseInt($next.val())-1)
	})

	$('.tab_list').on('click', '.btn_decrease', function(){
		var $next = $(this).next()
		$next.attr('value',parseInt($next.val())-1)
	})

	$('.btn_increase').click(function(){
		var $prev = $(this).prev()
		$prev.attr('value',parseInt($prev.val())+1)
	})

	$('.tab_list').on('click', '.btn_increase', function(){
		var $prev = $(this).prev()
		$prev.attr('value',parseInt($prev.val())+1)
	})

	//拆分采购按钮
	$('.split_buy_btn').click(function(){
		window.location.href='split-demand.html'
	})

	$('.tab_list').on('click', '.split_buy_btn', function(){
		window.location.href='split-demand.html'
	})

	//导入file按钮
	$('.import_file_btn').change(function(){
		window.location.href='imp-demand.html'
	})

	//供应商报价增加一行
	$('.tab_list').on('click','.glyphicon-plus-signadd', function(){
		var $operation = $(this).parent().parent().find('td').eq(2).text()=='无'?'报价':'替代报价';

		$(this).parent().parent().after('<tr class="bg_gree"><td></td><td></td><td></td><td></td><td></td><td><span>'+$operation+'</span></td><td><input class="form-control" type="text"></td><td><input class="form-control" type="text"></td><td><input class="form-control" type="text"></td><td></td><td><input class="form-control offer_ipt" type="text"></td><td></td><td></td><td></td><td></td><td></td><td><span class="glyphicon glyphicon-minus glyphicon-remove-circle2"></span></td></tr>')
	})

	//删除一行
	$('.glyphicon-remove-circle2').parents('table').on('click','.glyphicon-remove-circle2',function(){
		//$(this).parent().parent().remove()
		console.log(11)
	})

	$('#suppy-quot-tb').on('click','.glyphicon-remove-circle2',function(){
		$(this).parent().parent().remove()
	})
	
	$('.tab_list').on('click','.glyphicon-remove-circle2',function(){
		$(this).parent().parent().remove()
	})

	//需求管理手动新增按钮跳转到提交采购订单
	$('.hand_add_href').click(function(){
		window.location.href='manual-input.html'
	})

	//供应商报价-厂牌输入框
	$('#suppy-quot-tb').on('focus','.offer_ipt',function(){
		var $top = $(this).offset().top+$(this).outerHeight()
			var $left = $(this).offset().left-($('.hand_add_box').outerWidth()-$(this).outerWidth())/2

		$('.hand_add_box').css({'left':$left+'px','top':$top+'px','display':'block'})
	})

	$('#suppy-quot-tb').on('blur','.offer_ipt',function(){
		$('.hand_add_box').hide();
	})

	//需求新增-合并按钮
	$('.merge').click(function(){
		window.location.href='split-demand.html'
	})

	//订单列表--订单查看按钮
	$('.omgm-list-link').click(function(){
		var orderNum = $(this).parent().siblings().eq(0).text();
		var orderName = $(this).parent().siblings().eq(1).text();
		var submitDate = $(this).parent().siblings().eq(2).text();
		
		$(this).attr('href','sub-order-list.html?'+'num='+orderNum+'&name='+orderName+'&date='+submitDate)
	});

	$('.tab_list').on('click','.omgm-list-link',function(){
		var orderNum = $(this).parent().siblings().eq(0).text();
		var orderName = $(this).parent().siblings().eq(1).text();
		var submitDate = $(this).parent().siblings().eq(2).text();
		
		$(this).attr('href','sub-order-list.html?'+'num='+orderNum+'&name='+orderName+'&date='+submitDate)
	});

	//提交订单按钮
	$('.submit-order-btn').click(function(){
		$('.pop').show()
	})

	//签订合同按钮
	$('.sign_btn').click(function(){
		$('.pop').show()
	})

	//分批收货
	$('.tab_list').on('click', '.j_batch', function(){
		var $addIpt = '<div class="j_show_wrap"><input type="text" class="j_batch_show" value="0"></div>'
		var $addConfirm = '<div class="j_confirm_wrap"><span class="btn red j_confirm mar_r">确认收货</span><span class="btn red j_confirm j_confirm2">删除</span></div>'
		var $tdShow = $(this).parent().siblings('.j_td_show');
		var $tdConfirm = $(this).parent().siblings('.j_td_confirm');

		$tdConfirm.append($addConfirm);
		$tdShow.append($addIpt);

 	})

	//确认收货
	$('.tab_list').on('click','.j_confirm.mar_r',function(){
		var idx = $(this).parent().index();

		if($(this).parent().siblings().length == 0){
			$(this).parent().parent().parent().remove();
		}

		$(this).parent().parent().parent().find('.j_show_wrap').eq(idx).remove();
		$(this).parent().remove();
	})

	//删除
	$('.tab_list').on('click','.j_confirm.j_confirm2',function(){
		var idx = $(this).parent().index();
		var $_this = $(this); 

		$('.pop').show();

		$('body').on('click','.j_batch_popsure',function(){
			$(this).parents('.pop').hide();

			if($_this.parent().siblings().length == 0){
				$_this.parent().parent().parent().remove();
			}

			$_this.parent().parent().parent().find('.j_show_wrap').eq(idx).remove();
			$_this.parent().remove();
		})
	})

	//上下边
	$('.yx').parents('body').css('padding','10px 0 30px')

	//菜单
	$('.page-sidebar-wrapper').addClass('j_sidebar').find('.sub_tree_list .nav-link ').click(function(){
		$(this).parents('.sub_tree_list').find('.nav-link ').removeClass('j_color1');
		$('.sub_tree_list').find('.nav-link ').removeClass('j_color1');
		$(this).addClass('j_color1')
	})

	getList()
})

//子订单数据
function getList(){
	var idx = window.location.href.indexOf('?')+1;
	var arr = window.location.href.substring(idx).split('&')

	for(var i=0;i<arr.length;i++){
		$('.sub-list-data').find('span').eq(i).text(decodeURI(arr[i].split('=')[1]))
	}
}