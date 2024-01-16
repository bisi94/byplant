(function ($) {
    "use strict";

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 40) {
            $('.navbar').addClass('sticky-top');
        } else {
            $('.navbar').removeClass('sticky-top');
        }
    });
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    function loadProducts() {
        $.ajax({
            url: '/getpd',  // 실제 서버 엔드포인트로 변경
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // 제품 목록을 받아왔을 때 실행되는 부분
                displayProducts(data);
            },
            error: function (xhr, status, error) {
                // 에러 발생 시의 처리
                console.error(xhr);
                console.error(status);
                console.error(error);
            }
        });
    }
    

    // 제품 목록을 받아와서 HTML에 추가하는 함수
    function displayProducts(products) {
        // 제품 목록을 보여줄 부모 요소
        var productContainer = $('.product-carousel');

        // 받아온 제품 데이터를 순회하면서 HTML에 추가
        products.forEach(function (product) {
           let PD_IMG=product.pd_IMG;
           let PD_NAME=product.pd_NAME;
           let PD_PRICE=product.pd_PRICE;
           let PD_ID=product.pd_ID;
            var productHtml = `
                <div class="pb-5">
                    <div class="product-item position-relative bg-light d-flex flex-column text-center">
                        <img class="img-fluid mb-4" src="`+PD_IMG+`" alt="">
                        <h6 class="text-uppercase">`+PD_NAME+`</h6>
                        <h5 class="text-primary mb-0">`+PD_PRICE+` WON</h5>
                        <div class="btn-action d-flex justify-content-center">
                            <a class="btn btn-primary py-2 px-3 btn-cart" href="#0" data-ID="`+PD_ID+`"><i class="bi bi-cart"></i></a>
                            <a class="btn btn-primary py-2 px-3" href="#0"><i class="bi bi-eye"></i></a>
                            
                        </div>
                    </div>
                </div>`;

            // 제품 목록에 HTML 추가
            productContainer.append(productHtml);
        });
        // 장바구니에 추가 버튼 클릭 이벤트 핸들러
        $(document).on('click', '.btn-cart', function(event) {
            // 클릭된 버튼에서 data-ID 값을 가져옵니다.
            var productId = $(this).data('id');
            console.log(productId);
            // Ajax 요청을 수행합니다.
            $.ajax({
                type: 'POST',
                url: '/addToCart',  // 실제 컨트롤러의 엔드포인트 URL을 입력하세요.
                data: {
                    PD_ID: productId
                    // 기타 필요한 제품 정보를 추가할 수 있습니다.
                },
                success: function(response) {
                    // 성공적으로 서버에서 응답을 받았을 때 수행할 동작을 정의합니다.
                    console.log('Ajax 요청 성공:', response);
                },
                error: function(error) {
                    // Ajax 요청이 실패했을 때 수행할 동작을 정의합니다.
                    console.error('Ajax 요청 실패:', error);
                }
            });

            // 기본 동작(stopPropagation 및 preventDefault)을 방지하여 a 태그의 기본 동작이 실행되지 않도록 합니다.
            event.stopPropagation();
            event.preventDefault();
        });

        // Owl Carousel 초기화
        initOwlCarousel();
    }

    // Owl Carousel 초기화 함수
    function initOwlCarousel() {
        $(".product-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            margin: 45,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="bi bi-arrow-left"></i>',
                '<i class="bi bi-arrow-right"></i>'
            ],
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                },
                1200: {
                    items: 4
                }
            }
        });
    }



    // loadProducts 함수 호출하여 제품 데이터를 가져와서 HTML에 추가
    loadProducts();


    // Team carousel
    $(".team-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });
    
})(jQuery);

