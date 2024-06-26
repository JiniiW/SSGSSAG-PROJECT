$(document).ready(function() {
    allDeactivateForm();
});

// 전역 변수
var orderSearch = {
    "vIncomingProductSupplierNm": null,
    "vWarehouseCd": null,
    "vProductCd": null
};

var order = {
    "pkOrderSeq": null,
    "vOrderStatus": null,
    "vIncomingProductSupplierNm": null,
    "vOrderType": null,
    "dtOrderCreatedDate": null,
    "dtDeliveryDate": "2024-03-21T10:00:00",
};

var saveStatus = {
    "order" : false,
    "orderDetail" : false
}

var addProducts = {};
const orderRegisterContainer = $('.order-register-container');


// 신규
function clickNewBtn() {
    $('#order-register-reset-btn').prop('disabled', false);
    orderRegisterContainer.find('.general-button button')
        .prop('disabled', false);

    newOrderForm();
    createOrderSeq();
    activateMasterForm();
}

function createOrderSeq() {
    $.ajax({
        url: '/order/register/order-seq',
        type: 'GET',
        success: function (data) {
            let orderSeq = data.orderSeq;
            $("#order-seq").val(orderSeq);
            $("#order-status").val("미확정");
        },
        error: function (error) {
            toastr.error("발주 번호 불러오기 실패")
        }
    });
}

function newOrderForm() {
    $("#order-created-date").val(getCurrentDateFormatted());
    $("#order-seq").val('');
    $("#incoming-product-supplier-nm").val('');
    $("#order-status").val('');
    $("#warehouse-cd").val('');
    $("#order-type").val(($('#order-type option[selected]').val()));
}

function activateMasterForm() {
    $('#order-register-form button')
        .not("#order-register-delete-btn")
        .prop('disabled', false);
    orderRegisterContainer.find('input, select').prop('disabled', false);
}

// 초기화
function allDeactivateForm() {
    orderRegisterContainer.find('button,input, select')
        .not('#order-register-new-btn, .modal button')
        .prop('disabled', true);
}

// 등록 폼

$(".input-supplier").click(function() {
    $.ajax({
        url: '/incoming/supplier',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            let tableBody = $("#purchaserSearchInputBox .table-responsive tbody");
            tableBody.empty();
            $.each(data, function(index, item) {
                let row = "<tr>" +
                    "<td>" + (index + 1) + "</td>" +
                    "<td>" + item.vincomingProductSupplierNm + "</td>" +
                    "</tr>";
                tableBody.append(row);
            });
        },
        error: function(xhr, status, error) {
            toastr.error("추가 실패 했습니다.");
        }
    });
});

$("#purchaserSearchInputBox .table-responsive tbody").on('click', 'tr', function() {
    let supplierName = $(this).find('td:nth-child(2)').text();
    $('.input-supplier').val(supplierName);
    $('#purchaserSearchInputBox').modal('hide');
});

$('.input-whsearch').click(function() {
    let formData = {
        name: $("#warehouseNameInput").val(),
        location: $("#warehouseLocationSelect").val(),
        type: $("#warehouseTypeSelect").val()
    };

    $.ajax({
        type: "POST",
        url: "/warehouse/search",
        data: $.param(formData),
        contentType: 'application/x-www-form-urlencoded',
        success: function(data) {
            let tableBody = $('#warehouseSearchInputBox .table-responsive tbody');
            tableBody.empty();
            $.each(data, function(i, warehouse) {
                let row = "<tr>" +
                    "<td>" + (i + 1) + "</td>" +
                    "<td>" + warehouse.swarehouseType + "</td>" +
                    "<td>" + warehouse.vwarehouseCd + "</td>" +
                    "<td>" + warehouse.vwarehouseNm + "</td>" +
                    "</tr>";
                tableBody.append(row);
            });
        },
        error: function(error) {
            toastr.error("창고 데이터 불러오기 실패")
        }
    });
});

$('#warehouseSearchInputBox .table-responsive tbody').on('click', 'tr', function() {
    let warehouseCode = $(this).find('td:nth-child(3)').text();
    $('.input-whsearch').val(warehouseCode);
    $('#warehouseSearchInputBox').modal('hide');
});


// 발주 - 저장
function clickOrderMasterSave() {
    if (!checkInputFields()) {
        $('#order-master-save-btn').removeAttr('data-target');
        toastr.info('입력되지 않은 값이 있습니다.');
    }
    else {
        $('#order-master-save-btn').attr('data-target','#exampleModalCenter');
        saveStatus.order = true;
    }
}
function orderRegisterSave() {
    toastr.success("발주 마스터가 저장되었습니다.");
    orderRegisterContainer.find('.input-supplier').prop('disabled', true);
    saveOrderForm();
    activateOrderSingleForm();
}

function activateOrderSingleForm() {
    orderRegisterContainer
        .find('#order-register-order-single-btn-wrap button')
        .prop('disabled', false);

}

function checkInputFields() {
    let allFilled = true;
    $('.order-master-form input,  .order-master-form select').each(function() {
        if ($(this).val().trim() === ''
            || $(this).val().trim() === '선택'
            || $(this).val().trim() === 'dd/mm/yyyy') {
            allFilled = false;
            // return false;
        }
    });
    return allFilled;
}


function saveOrderForm() {
    order.dtOrderCreatedDate = dateFormatting($("#order-created-date").val());
    order.pkOrderSeq = $("#order-seq").val();
    order.vIncomingProductSupplierNm = $("#incoming-product-supplier-nm").val();
    order.vOrderStatus = $("#order-status").val();
    order.vWarehouseCd = $("#warehouse-cd").val();
    order.vOrderType = $("#order-type").val();
}

// 발주 - 삭제
function deleteOrder() {
    $.ajax({
        url: `/order/register/${order.pkOrderSeq}`,
        type: 'DELETE',
        success: function (resp) {
            toastr.success("성공적으로 삭제되었습니다.");
            setTimeout(() => {
                window.location.href = "/order/register";
            }, 1500);
        },
        error: function (error) {
            toastr.error("삭제 실패했습니다.");
        }
    });
}

function orderRegisterReset() {
    $("#order-created-date").val('dd/mm/yyyy');
    $("#order-seq").val('');
    $("#incoming-product-supplier-nm").val('');
    $("#order-status").val('');
    $("#warehouse-cd").val('');
    $("#order-type").val(($('#order-type option[selected]').val()));
    $('.order-detail-tbody').empty().append(`
        <tr id="default-tr">
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
        </tr>
    `)
    $('#input-product-cd').val('');
    allDeactivateForm();
}

function orderObjectDelete() {
    order = {
        "pkOrderSeq": null,
        "vOrderStatus": null,
        "vIncomingProductSupplierNm": null,
        "vOrderType": null,
        "dtOrderCreatedDate": null,
        "dtDeliveryDate": null,
    }
}


// 발주 상세 - 저장
function insertOrderAndOrderDetail() {
    let orderDetails = saveOrderDetailForm();

    if (orderDetails.length === 0)
        return;

    if (saveStatus.order && saveStatus.orderDetail) {
        $.ajax({
            url: '/order/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({order: order, orderDetails: orderDetails}),
            success: function (resp) {
                orderRegisterContainer.find('button, input, select')
                    .not('#order-register-new-btn, .modal button')
                    .prop('disabled', true);
                $('#order-register-delete-btn').prop('disabled', false);
                toastr.success("발주가 등록되었습니다.");
            },
            error: function (error) {
                toastr.error('발주 등록 실패했습니다. 다시 시도해주세요.');
            }
        });
    }
    else {
        toastr.info("입력되지 않은 값이 있습니다.");
    }
}

function saveOrderDetailForm() {
    let orderDetails = [];
    let isValid = true;

    if ($('.order-detail-tbody input[type="checkbox"]:checked').length === 0) {
        toastr.info("단품을 입력하세요.").
        return;
    }


    $('.order-detail-tbody input[type="checkbox"]:checked').each(function() {
        if (!isValid) return;

        let $tr = $(this).closest('tr');
        let productCd = $tr.find('.product-cd').text();
        let orderCnt = +$tr.find('.order-cnt').val();

        if (!orderCnt) {
            toastr.info("단품 수량을 입력하세요.");
            isValid = false;
            return;
        }

        let orderDetail = {
            pkOrderSeq: order.pkOrderSeq,
            nOrderCnt: orderCnt,
            vProductCd: productCd,
            vWarehouseCd: order.vWarehouseCd
        };

        orderDetails.push(orderDetail);
    });

    if (!isValid) {
        saveStatus.orderDetail = false;
        return [];
    }

    saveStatus.orderDetail = true;
    return orderDetails;
}


// 발주 상세 - 추가
function createOrderDetailForm() {
    orderSearch.vIncomingProductSupplierNm = order.vIncomingProductSupplierNm;
    orderSearch.vProductCd = $("#input-product-cd").val();
    orderSearch.vWarehouseCd = order.vWarehouseCd;
    if (!checkDuplicateProductRegistration(orderSearch.vProductCd))
        return;

    $.ajax({
        url: '/order/register/detail',
        type: 'POST',
        contentType:'application/json',
        data:
            JSON.stringify(orderSearch),
        success: function (resp) {
            $("#default-tr").remove();
            addProducts[resp.vProductCd] = 1;

            let idx = $(".order-detail-tbody tr").length + 1;
            $('#input-product-cd').val('');

            $(".order-detail-tbody").append(
                `<tr data-index="${idx}">
                    <th>${idx}</th>
                    <td><input type="checkbox" class="order-checked" /></td>
                    <td class="product-cd">${resp.vProductCd}</td>
                    <td class="product-nm">${resp.vProductNm}</td>
                    <td class="inventory-cnt">${resp.nInventoryCnt}</td>
                    <td>
                        <div class="input-group">
                            <input type="number" class="order-cnt" style="width:60px">
                        </div>
                    </td>
                    <td class="product-price">${addCommas(resp.nProductPrice)}</td>
                    <td class="total-price"></td>
                </tr>`
            );
        },
        error: function (xhr, status, error) {
            if (xhr.status === 404 || xhr.status === 400) {
                toastr.warning(xhr.responseText);
            }
            else {
                toastr.error(xhr.responseText);
            }
        }
    });
}

function checkDuplicateProductRegistration(productCd) {
    if (productCd in addProducts) {
        toastr.warning("이미 추가된 상품입니다.");
        return false;
    }

    return true;
}


$('body').on('input', '[class^=order-cnt]', function() {
    let $tr = $(this).closest('tr');
    let totalPrice = calculateOrderTotalPrice($tr);
    $tr.find('.total-price').text(totalPrice);
});

// 발주 상세 - 삭제
function deleteOrderSingle() {
    $('.order-detail-tbody input[type="checkbox"]:checked').each(function() {
        let productCd = $(this).closest('tr').find(".product-cd").text();
        $(this).closest('tr').remove();

        if ($('.order-detail-tbody tr').length === 0) {
            $('.order-detail-tbody').append(`
                <tr id="default-tr">
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            `)
        }

        delete addProducts[productCd];
    });

    $('.order-detail-tbody tr').each(function(index) {
        let newIndex = index + 1;
        $(this).attr('data-index', newIndex);
        $(this).find('th').first().text(newIndex);
    });
}

// 기타
function dateFormatting(dateString) {
    let date = new Date(dateString);

    // 한국 시간대(KST, UTC+9) 설정
    let kstOffset = 9 * 60;
    let localDate = new Date(date.getTime() + kstOffset * 60000);

    let formattedDate = localDate.toISOString().replace('Z', '+09:00').substring(0, 19);

    return formattedDate;
}


function calculateOrderTotalPrice($tr) {
    let orderCnt = +$tr.find('.order-cnt').val();
    let productPrice = removeCommas($tr.find('.product-price').text());
    return addCommas(orderCnt * productPrice);
}

function getCurrentDateFormatted() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
}

function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeCommas(str) {
    return parseInt(str.replace(/,/g, ''), 10);
}

$("#cbx_chkAll").click(function() {
    if($("#cbx_chkAll").is(":checked")) $("input[class=order-checked]").prop("checked", true);
    else $("input[class=order-checked]").prop("checked", false);
});

$("input[class=order-checked]").click(function() {
    let total = $("input[class=order-checked]").length;
    let checked = $("input[class=order-checked]:checked").length;

    if(total != checked) $("#cbx_chkAll").prop("checked", false);
    else $("#cbx_chkAll").prop("checked", true);
});
