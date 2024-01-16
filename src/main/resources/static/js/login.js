jQuery(document).ready(function($){
	var $form_modal = $('.cd-user-modal'),
		$form_login = $form_modal.find('#cd-login'),
		$form_signup = $form_modal.find('#cd-signup'),
		$form_forgot_password = $form_modal.find('#cd-reset-password'),
		$form_modal_tab = $('.cd-switcher'),
		$tab_login = $form_modal_tab.children('li').eq(0).children('a'),
		$tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
		$forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
		$back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a'),
		$login_nav = $('.login-nav');
	let idcheck=0;	
	let checkCount=0;
	let emailConfirm=0;
	//open modal
	$login_nav.on('click', function(event){
		if (!$(event.target).is('.cd-signup')) {
			event.preventDefault();
			event.stopPropagation();
			$form_modal.addClass('is-visible');
			login_selected();
		}
		else if( $(event.target).is($login_nav) ) {
			// on mobile open the submenu
			$(this).children('a').toggleClass('is-visible');
		} else {
			// on mobile close submenu
			$login_nav.children('a').removeClass('is-visible');
			//show modal layer
			$form_modal.addClass('is-visible');	
			//show the selected form
			( $(event.target).is('.cd-signup') ) ? signup_selected() : login_selected();
		}

	});


	$('#emailcf').on('click',function(event){
		event.preventDefault();
		let email=$('#signup-email').val();
		if (isValidEmail(email)) {
		$.ajax({
			type: 'POST',
			url: '/sendVerificationEmail',  // 실제 회원가입 엔드포인트로 변경
			data: {email:email},
			success: function(response) {
				$('#confirmemail').show();

			},
			error: function(error) {
				console.error(error);
			}
		});
	}else{
		$('#emailformcf').text("올바른 이메일 형식이 아닙니다.");
			$('#emailformcf').css('visibility', 'visible');
			setTimeout(function() {
				$('#emailformcf').css('visibility', 'hidden');
			}, 5000);
	}
		
	});
	
	$('#tokencf').on('click', function(event) {
		event.preventDefault();
		checkCount++;
	
		if (checkCount < 5) {
			// verificationToken 쿠키에서 토큰 가져오기
			var verificationToken = getCookie("verificationToken");
	
			// email 쿠키에서 이메일 가져오기
			var email = getCookie("email");
	
			if (verificationToken && email) {
				// emailchecke에 입력된 값 가져오기
				var enteredToken = $('#emailchecke').val();
				var enteredEmail = $('#signup-email').val();
	
	
				// 쿠키 값과 입력된 값 비교
				if (verificationToken === enteredToken && email === enteredEmail) {
					// 토큰 및 이메일 일치하는 경우에 할 작업
					$('#tokenerror').text("인증 성공");
					$('#tokenerror').css('visibility', 'visible');
					setTimeout(function() {
						$('#tokenerror').css('visibility', 'hidden');
					}, 5000);
					emailConfirm = 77;
				} else if (email !== enteredEmail) {
					$('#tokenerror').text("요청한 이메일과 입력되어있는 이메일이 다릅니다.");
					$('#tokenerror').css('visibility', 'visible');
					setTimeout(function() {
						$('#tokenerror').css('visibility', 'hidden');
					}, 5000);
				} else {
					// 토큰 불일치하는 경우에 할 작업
					$('#tokenerror').text("인증 " + checkCount + "회 실패.");
					$('#tokenerror').css('visibility', 'visible');
					setTimeout(function() {
						$('#tokenerror').css('visibility', 'hidden');
					}, 5000);
				}
			}else{
					$('#tokenerror').text("인증키값이 존재하지 않습니다. 이메일 인증을 다시 시도해주세요");
					$('#tokenerror').css('visibility', 'visible');
					setTimeout(function() {
						$('#tokenerror').css('visibility', 'hidden');
					}, 5000);
					checkCount = 0;
					deleteCookie("verificationToken");
					deleteCookie("email");
			}
		} else {
			$('#tokenerror').text("인증키값 입력을 5번 이상 실패했습니다. 이메일 인증을 다시 해주세요.");
			$('#tokenerror').css('visibility', 'visible');
			checkCount = 0;
			deleteCookie("verificationToken");
			deleteCookie("email");
		}
	});
	
	// 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
	function getCookie(name) {
		var nameEQ = name + "=";
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1, cookie.length);
			}
			if (cookie.indexOf(nameEQ) === 0) {
				return cookie.substring(nameEQ.length, cookie.length);
			}
		}
		return null;
	}
	
	// 쿠키 삭제 함수
	function deleteCookie(name) {
		document.cookie = name + '=; Max-Age=0; path=/; domain=' + window.location.hostname;
	}
	

	function isValidEmail(email) {
		// 간단한 이메일 유효성 검사 정규 표현식
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	//close modal
	$('.cd-user-modal').on('click', function(event){
		if( $(event.target).is($form_modal) || $(event.target).is('.cd-close-form') ) {
			$form_modal.removeClass('is-visible');
			$('#signup-userid').val('');
			$('#signup-username').val('');
        	$('#signup-password').val('');
        	$('#signup-passwordchecke').val('');
			$('#signup-email').val('');
			$('#signup-tel').val('');
			$('#signup-postnum').val('');
			$('#signup-addr').val('');
			$('#signup-addrd').val('');
			$('#accept-terms').prop('checked', false);
			idcheck=0;
			emailConfirm=0;
			checkCount = 0;
			deleteCookie("verificationToken");
			deleteCookie("email");
		}	
	});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$form_modal.removeClass('is-visible');
			$('#signup-userid').val('');
			$('#signup-username').val('');
        	$('#signup-password').val('');
        	$('#signup-passwordchecke').val('');
			$('#signup-email').val('');
			$('#signup-tel').val('');
			$('#signup-postnum').val('');
			$('#signup-addr').val('');
			$('#signup-addrd').val('');
			$('#accept-terms').prop('checked', false);
			idcheck=0;
			emailConfirm=0;
			checkCount = 0;
			deleteCookie("verificationToken");
			deleteCookie("email");
	    }
    });

	//switch from a tab to another
	$form_modal_tab.on('click', function(event) {
		event.preventDefault();
		( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
	});

	//hide or show password
	$('.hide-password').on('click', function(){
		var $this= $(this),
			$password_field = $this.prev('input');
		
		( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
		( 'Hide' == $this.text() ) ? $this.text('Show') : $this.text('Hide');
		//focus and move cursor to the end of input field
		$password_field.putCursorAtEnd();
	});

	//show forgot-password form 
	$forgot_password_link.on('click', function(event){
		event.preventDefault();
		forgot_password_selected();
	});

	//back to login from the forgot-password form
	$back_to_login_link.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

	function login_selected(){
		$form_login.addClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.addClass('selected');
		$tab_signup.removeClass('selected');
	}

	function signup_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.addClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.removeClass('selected');
		$tab_signup.addClass('selected');
	}

	function forgot_password_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.addClass('is-selected');
	}

	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
		  	}
		}).blur(function() {
		 	var input = $(this);
		  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
		  	}
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  	$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
			 		input.val('');
				}
		  	})
		});
	}
	

});


$('#login').submit(function(e) {
	e.preventDefault(); // 기본 제출 동작 막기

	if(idcheck==9){}
	// 폼 데이터 가져오기
	var formData = {
		email: $('#signin-email').val(),
		password: $('#signin-password').val(),
		rememberMe: $('#remember-me').is(':checked')
	};

	// Ajax 요청
	$.ajax({
		type: 'POST',
		url: '/loginchecke',  // 실제 로그인 엔드포인트로 변경
		data: formData,
		success: function(response) {
			// 서버 응답에 대한 처리
			console.log(response);
		},
		error: function(error) {
			// 오류 처리
			console.error(error);
		}
	});
});

$('#signup').submit(function(e) {
	e.preventDefault(); // 기본 제출 동작 막기

	// 폼 데이터 가져오기
	var formData = {
		USER_NAME: $('#signup-username').val(),
		EMAIL: $('#signup-email').val(),
		PWD: $('#signup-password').val(),
		ADDR:$('#signup-addr').val(),
		TEL:$('#signup-tel').val(),
		SUB:0
	};

	// Ajax 요청
	$.ajax({
		type: 'POST',
		url: '/signup',  // 실제 회원가입 엔드포인트로 변경
		data: formData,
		success: function(response) {
			// 서버 응답에 대한 처리
			alert(response);
		},
		error: function(error) {
			// 오류 처리
			console.error(error);
		}
	});
});

	


function checkForDuplicate(){
	
	let userIdIput= document.getElementById('signup-userid');
	let userId=userIdIput.value;
	if(userId!=null&&userId!=""){
	$.ajax({
		type:'POST',
		url:'/idcheck',
		data:{ userId: userId },
		success:function(res){
			$('#idcheckerror').text(res);
			$('#idcheckerror').css('visibility', 'visible');
			setTimeout(function() {
				$('#idcheckerror').css('visibility', 'hidden');
			}, 5000);
			if(res=="사용가능한 아이디입니다."){
				idcheck=9;
			}
		},
		error:function(error){
			$('#idcheckerror').text("서버와의 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요");
			$('#idcheckerror').css('visibility', 'visible');
			setTimeout(function() {
				$('#idcheckerror').css('visibility', 'hidden');
			}, 5000);
		}
	});
	}else{
		$('#idcheckerror').text('아이디를 입력해 주세요');
		$('#idcheckerror').css('visibility', 'visible');
		setTimeout(function() {
			$('#idcheckerror').css('visibility', 'hidden');
		}, 5000);
	}
}

$form_login.find('input[type="submit"]').on('click', function(event){
	event.preventDefault();
	$form_login.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
});
$form_signup.find('input[type="submit"]').on('click', function(event){
	event.preventDefault();
	$form_signup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
});
function postnum() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var roadAddr = data.roadAddress; // 도로명 주소 변수
			var extraRoadAddr = ''; // 참고 항목 변수

			// 법정동명이 있을 경우 추가한다. (법정리는 제외)
			// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
			if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
				extraRoadAddr += data.bname;
			}
			// 건물명이 있고, 공동주택일 경우 추가한다.
			if(data.buildingName !== '' && data.apartment === 'Y'){
			   extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
			}
			// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
			if(extraRoadAddr !== ''){
				extraRoadAddr = ' (' + extraRoadAddr + ')';
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			document.getElementById('signup-postnum').value = data.zonecode;
			document.getElementById("signup-addr").value = roadAddr;
			// 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
		}
	}).open();
}
function deliveryAddr() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var roadAddr = data.roadAddress; // 도로명 주소 변수
			var extraRoadAddr = ''; // 참고 항목 변수

			// 법정동명이 있을 경우 추가한다. (법정리는 제외)
			// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
			if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
				extraRoadAddr += data.bname;
			}
			// 건물명이 있고, 공동주택일 경우 추가한다.
			if(data.buildingName !== '' && data.apartment === 'Y'){
			   extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
			}
			// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
			if(extraRoadAddr !== ''){
				extraRoadAddr = ' (' + extraRoadAddr + ')';
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			document.getElementById("postnumInput").value = data.zonecode;
			document.getElementById("addressInput").value = roadAddr;
			// 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
		}
	}).open();
}



//credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function() {
	return this.each(function() {
    	// If this function exists...
    	if (this.setSelectionRange) {
      		// ... then use it (Doesn't work in IE)
      		// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      		var len = $(this).val().length * 2;
      		this.setSelectionRange(len, len);
    	} else {
    		// ... otherwise replace the contents with itself
    		// (Doesn't work in Google Chrome)
      		$(this).val($(this).val());
    	}
	});
};