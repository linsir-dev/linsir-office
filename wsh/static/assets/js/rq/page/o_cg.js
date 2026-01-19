define(['jquery'], function ($) {
    $(function () {
        $.ajax({
            type: "GET",
            url: "/apis/preq/order-list2.json",
            data: {},
            success: function (data) {
                var html = "";
                var d;
                for (var item=0; item<data.list.length;item++) {
                    d = data.list[item];
                    if (d.emphasizeBg === false) {
                        html += '<tr>';
                    } else {
                        html += '<tr bgcolor="yellow">';
                    }
                    html += '<td align="center">' + d.drugSno + '</td>';
                    html += '<td align="center">' + d.baseName + '</td>';
                    html += '<td align="center">' + d.dose + '</td>';
                    if (d.specification === false) {
                        html += '<td align="center">';
                        html += '更改为<input type="radio" checked="checked" name="item1"></td>';

                    } else {
                        html += '<td align="center">100s/瓶</td>';
                    }
                    html += '<td align="center">' + d.proManufactor + '</td>';
                    html += '<td align="center">' + d.oNumber + '</td>';
                    html += '<td align="center">' + d.minMoney + '</td>';
                    html += '<td align="center">' + d.singlePrice + '</td>';
                    html += '<td>' + d.hcpd + '</td>';
                    if (d.hangNet === false & d.on === true) {
                        html += '<td class="bg_color_red" align="center">';
                        html += '<span class="glyphicon glyphicon-remove"></span></td>'
                    } else if (d.hangNet === false & d.on === false) {
                        html += '<td align="center">';
                        html += '<span class="glyphicon glyphicon-remove"></span></td>'
                    }else {
                        html += '<td align="center">';
                        html += '<span class="bg_color_blue">in</span></td>';
                    }
                    html += '<td>' + d.packQuantity + '</td>';
                    html += '<td>' + d.integerQuantity + '</td>';
                    html += '<td>' + d.scatteredQuantity + '</td>';
                    html += '<td>' + d.drugSpecific + '</td>'
                    html += '<td>' + d.distributeTime + '</td>'
                    html += '<td>' + d.selectorMode + '</td></tr>'
                }
                
                $('.table tbody').append(html)
            }
        });
    })
})
