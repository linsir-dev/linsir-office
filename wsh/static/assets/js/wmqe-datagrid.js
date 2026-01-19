
var Wmqe = function(elm){
    this.table = $(elm);
};

var DataGridListeners = function(){
    
};
DataGridListeners.prototype.rowAdding = function(index, row){
    //alert(index);
};
DataGridListeners.prototype.rowAdded = function(index, row){
    
};

Wmqe.prototype.datagrid = function(url,cols,listeners){
    if(listeners == null)
        listeners = new DataGridListeners();
    
    var otable = this.table;
    $.ajax({
		type: "get",
		url: url,
		dataType: "json",
		success: function(data){
            var headerTr = $("<tr></tr>");
            /* 构建标题 */   
            for(var idx in cols){
                var th =$("<th>"+cols[idx].colTitle+"</th>");                
                th.appendTo(headerTr);
            }            
            headerTr.appendTo(otable);
            
            /* 构建数据行 */
			$.each(data.list, function(index, item){
                var rowTr = $("<tr></tr>");               

                for(var i in cols){
                    var rowTd = $("<td></td>");
    
                    if(cols[i].cssClass){
                        rowTd.addClass(cols[i].cssClass);
                    }
                    
                    if(cols[i].template) // 如果是模版
                        rowTd.html(cols[i].template); //htm += cols[idx].template+"</td>";
                    else if(cols[i].colName) // 如果是数据
                        rowTd.html(item[cols[i].colName]); //htm += item[cols[idx].colName]+"</td>";
                    else 
                        rowTd.html("&nbsp;"); //htm += "&nbsp;</td>";                   
                    
                    rowTd.appendTo(rowTr);
                }
                
                 if(listeners.rowAdding)
                     listeners.rowAdding(index,rowTr);               
                    
                rowTr.appendTo(otable); 
                
                 if(listeners.rowAdded)
                     listeners.rowAdded(index,rowTr);
			})
		},
		error: function(XMLHTTPRequest, textStatus, errorThrown){
			console.log("sorry error")
		}
	});
};

var Wq = function(elm){
   return (new Wmqe(elm))
};

/*
var GridTemplate = {};
var GridTemplate.getEditAndDelete = function(){
    return '<a href="manual-input.html?reqNo=${reqNo}" class="btn btn-warning">编辑</a><button class="btn btn-danger mar_l glyphicon-remove-circle2">删除</button>';
}*/

