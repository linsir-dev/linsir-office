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
                    html += '<td><input type="checkbox"></td>'
                    html += '<td>' + d.drugSno + '</td>'
                    html += '<td>' + d.baseName + '</td>'
                    html += '<td>' + d.dose + '</td>'
                    html += '<td>' + d.specification + '</td>'
                    html += '<td>' + d.proManufactor + '</td>'
                    html += '<td>' + d.quantity + '</td>'
                    html += '<td><span class="actual_num">' + d.actualQuantityReceived + '</span></td>'
                    html += '<td>' + d.sPrice + '</td>'
                    html += '<td>' + d.slPrice + '</td>'
                    html += '<td>' + d.batch + '</td>'
                    html += '<td>' + d.validity + '</td>'
                    html += '<td>' + d.packQuantity + '</td>'
                    html += '<td>' + d.integerQuantity + '</td>'
                    html += '<td><span class="btn btn-danger">确认收货</span></td>'
                    html += '<td>' + d.distributeTime + '</td>'
                    html += '</tr>'

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
