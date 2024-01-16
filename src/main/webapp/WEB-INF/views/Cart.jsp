<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="top.jspf" %>
<%@ page import="java.util.List" %>
<%@ page import="com.bp.model.ProductVo" %>
<link href="/css/Cart.css" rel="stylesheet">
<div class="card">
    <div class="row">
        <div class="col-md-8 cart">
            <div class="title">
                <div class="row">
                    <div class="col"><h4><b>Shopping Cart</b></h4></div>
                    <div class="col align-self-center text-right text-muted"></div>
                    <button class="col align-items-right" onclick="emptycart()">장바구니 비우기</button>
                </div>
            </div>
            <div class="row border-top border-bottom" id="productRow">
                <!-- 제품 정보가 여기에 동적으로 추가될 것입니다. -->
            </div>
            <div class="back-to-shop"><a href="#">&leftarrow;</a><span class="text-muted">Back to shop</span></div>
        </div>
        <div class="col-md-4 summary">
            <div><h5><b>Summary</b></h5></div>
            <hr>
            <div class="row">
                <div class="col" id="sumquantity"style="padding-left:0;">0개</div>
                <div class="col text-right" id="sumPrice"></div>
            </div>
            <form>
                <p>배송지</p>
                <!-- 체크박스와 주소 입력란 -->
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="customAddressCheckbox">
                    <label class="form-check-label" for="customAddressCheckbox">기본 배송지</label>
                </div>

                <div class="form-group" id="customAddress">
                    <div style="display: flex"><input type="text"  id="postnumInput" placeholder="우편번호" readonly><button class="col btn btn-dark" onclick="deliveryAddr()">우편번호 검색</button></div>
                    <input type="text" class="form-control" id="addressInput" placeholder="주소를 입력하세요" readonly>
                    <input type="text" class="form-control" placeholder="상세주소">
                </div>
                <select><option class="text-muted">배송료- 3000 원</option></select>
           
            <div class="row" style="border-top: 1px solid rgba(0,0,0,.1); padding: 2vh 0;">
                <div class="col">TOTAL PRICE</div>
                <div class="col text-right" id="totalPrice"></div>
            </div>
            </form>
            <button class="btn">결제</button>
        </div>
    </div>
</div>
<%@ include file="footer.jspf"%>

<!-- 서버에서 전달받은 제품 목록 -->
<%
    List<ProductVo> cartList = (List<ProductVo>) request.getAttribute("cartList");
%>

<!-- 제품 div를 동적으로 생성하는 함수 -->
<script>
    function generateProductDiv(product,i) {
        var quantity = 1; // 초기 수량
        var productDiv = document.createElement("div");
        productDiv.className = "row main align-items-center";

        // 제품 이미지 칼럼
        var imageCol = document.createElement("div");
        imageCol.className = "col-2";
        var image = document.createElement("img");
        image.className = "img-fluid";
        image.src = product.PD_IMG;
        imageCol.appendChild(image);
        productDiv.appendChild(imageCol);

        // 제품 세부 정보 칼럼
        var detailsCol = document.createElement("div");
        detailsCol.className = "col";
        var text2 = document.createElement("div");
        text2.className = "row";
        text2.innerText = product.PD_NAME;
        detailsCol.appendChild(text2);
        productDiv.appendChild(detailsCol);

        // 수량 칼럼
        var quantityCol = document.createElement("div");
        quantityCol.className = "col";
        var decreaseLink = document.createElement("a");
        decreaseLink.href = "#";
        decreaseLink.onclick = function () {
             // 최소 수량은 0으로 제한
             console.log(quantity);
            if (quantity >0) {
                quantity--;
                $('#quantity' + i).text(quantity);
                $('#productPrice' + i).text(product.PD_PRICE * quantity + " 원");
                sumquantity();
               
            } else {
                let pdremove=confirm('수량이 0개입니다 삭제하시겠습니까?');
                if(pdremove){
                    productDiv.remove();
                    sumquantity();
                    console.log(product.PD_ID);
                    emptycart(product.PD_ID);
                    
                }else{
                alert("취소되었습니다.");
                }
                 
            }
        };
        decreaseLink.innerText = "-";
        var quantityLink = document.createElement("a");
        quantityLink.href = "";
        quantityLink.className = "border";
        quantityLink.id = "quantity"+i;
        quantityLink.innerText = quantity; // 초기 수량 설정
        var increaseLink = document.createElement("a");
        increaseLink.href = "#";
        increaseLink.onclick = function () {
            quantity = quantity + 1;
            $('#quantity' + i).text(quantity);
            $('#productPrice'+i).text(product.PD_PRICE*quantity+" 원");
            sumquantity();
        };
        increaseLink.innerText = "+";
        quantityCol.appendChild(decreaseLink);
        quantityCol.appendChild(quantityLink);
        quantityCol.appendChild(increaseLink);
        productDiv.appendChild(quantityCol);

        // 가격 칼럼
        var priceCol = document.createElement("div");
        priceCol.className = "col";
        priceCol.id="productPrice"+i;
        priceCol.innerText = product.PD_PRICE*quantity + " 원";
        var closeSpan = document.createElement("span");
        closeSpan.className = "close";
        priceCol.appendChild(closeSpan);
        productDiv.appendChild(priceCol);
        return productDiv;
    }

    // 제품 div를 추가할 부모 컨테이너 가져오기
    var productContainer = document.getElementById("productRow");
    let index=0;
    <% if (cartList != null) { %>
    <% for (int i = 0; i < cartList.size(); i++) { %>
        // 이미 추가된 제품인지 확인
        var existingProductDiv = findProductDivByName('<%= cartList.get(i).getPD_NAME() %>');
        if (existingProductDiv) {
            // 이미 추가된 경우, 건너뛰고 다음으로 진행
        }else{
        // 새로운 제품 추가
        var product = {
            PD_IMG: '<%= cartList.get(i).getPD_IMG() %>',
            PD_OVERVIEW: '<%= cartList.get(i).getPD_OVERVIEW() %>',
            PD_NAME: '<%= cartList.get(i).getPD_NAME() %>',
            PD_SQ: '<%= cartList.get(i).getPD_SQ() %>',
            PD_PRICE: '<%= cartList.get(i).getPD_PRICE() %>',
            PD_ID: '<%= cartList.get(i).getPD_ID() %>'
        };
        var productDiv = generateProductDiv(product, index); // index를 전달하여 PD_SQ 값을 수정
        productDiv.id = 'productDiv'+index; // 고유한 ID 부여
        index++;
        productContainer.appendChild(productDiv);
        sumquantity();
    }
    <% } %>
<% } else { %>
    // JavaScript로 메시지를 추가합니다.
    productContainer.innerHTML = '';
    var emptyCartMessage = document.createElement('div');
    emptyCartMessage.innerText = '장바구니가 비었습니다.';
    productContainer.appendChild(emptyCartMessage);
<% } %>


    // 제품 이름으로 제품 div를 찾는 함수
    function findProductDivByName(productName) {
        var productDivs = document.querySelectorAll('.row.main.align-items-center');
        for (var i = 0; i < productDivs.length; i++) {
            var nameElement = productDivs[i].querySelector('.row');
            if (nameElement && nameElement.innerText.trim() === productName) {
                return productDivs[i];
            }
        }
        return null;
    }



    function sumquantity(){
        var sumq = 0;
        var sumPrice = 0;

        $("#productRow").children().each(function() {
            var quantityElement = $(this).find("[id^='quantity']");
            var priceElement = $(this).find("[id^='productPrice']");

            if (quantityElement.length && priceElement.length) {
                var q = parseInt(quantityElement.text(), 10);
                var p = parseInt(priceElement.text().replace(' 원', ''), 10);
                sumq += q;
                sumPrice += p;
            }
        });
    $('#sumquantity').text("총"+sumq + "개");
    $('#sumPrice').text(sumPrice+" 원");
    $('#totalPrice').text(sumPrice+3000+" 원")
};
function emptycart(PD_ID) {
    // 여기에서 세션의 cartList를 초기화하는 로직을 추가
    if (PD_ID !== undefined) {
        console.log('PD_ID');
    $.ajax({
        url: '/clearCart', // 적절한 컨트롤러 매핑 주소로 변경
        method: 'POST', // 또는 GET, 적절한 HTTP 메서드로 변경
        data: { PD_ID: PD_ID }, // PD_ID를 전송
        success: function(response) {
        },
        error: function(error) {
            // 오류 발생 시 수행할 작업 추가
            alert('장바구니 비우기 실패');
        }
    });
}else{
    $.ajax({
            url: '/clearCart', // 적절한 컨트롤러 매핑 주소로 변경
            method: 'POST', // 또는 GET, 적절한 HTTP 메서드로 변경
            success: function(response) {
                // 성공적으로 세션을 초기화했을 때 수행할 작업 추가
                productContainer.innerHTML = '';
                var emptyCartMessage = document.createElement('div');
                    emptyCartMessage.innerText = '장바구니가 비었습니다.';
                    productContainer.appendChild(emptyCartMessage);
                    sumquantity();
                // 적절한 페이지 리로드 또는 다른 동작 수행
            },
            error: function(error) {
                // 오류 발생 시 수행할 작업 추가
                alert('장바구니 비우기 실패');
            }
        });
    }
}

</script>
