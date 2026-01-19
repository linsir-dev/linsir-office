define(['jquery'], function ($) {
    $(function () {
        $.ajax({
            type: "GET",
            url: "/apis/preq/order-list2.json",
            data: {},
            success: function (data) {
                var html = "";
                var d;
                for (item in data.list) {
                    d = data.list[item];
                    console.log(d.clQuotation);
                    html += '<tr>'
                    html += '<td align="center">' + d.drugSno + '</td>'
                    html += '<td align="center">' + d.baseName + '</td>'
                    html += '<td align="center">' + d.drugSpecific + '</td>'
                    html += '<td align="center">' + d.prickle + '</td>'
                    html += '<td align="center">' + d.proManufactor + '</td>'
                    html += '<td align="center">' + d.quantity + '</td>'
                    html += '<td align="center">' + d.sPrice + '</td>'
                    html += '<td align="center">' + d.slPrice + '</td>'
                    html += '<td>' + d.batch + '</td>'
                    html += '<td>' + d.validity + '</td>'
                    html += '<td>' + d.packQuantity + '</td>'
                    html += '<td>' + d.integerQuantity + '</td>'
                    html += '<td>' + d.scatteredQuantity + '</td>'
                    html += '<td>' + d.deliveredQuantity + '</td></tr>'

                }

                console.log(html)
                $('.table tbody').append(html)
            },
            error: function (a, b, c) {

                console.log([a, b, c].join('|'));
            }
        });
    })
})
