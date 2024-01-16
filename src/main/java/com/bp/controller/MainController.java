package com.bp.controller;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bp.mapper.ProductMapper;
import com.bp.mapper.UserMapper;
import com.bp.model.ProductVo;
import com.bp.model.UserVo;
import com.bp.service.EmailService;

@Controller
public class MainController {
	
	@Inject
	private ProductMapper pm;
	
	@Inject
	private UserMapper um;
	
	@Autowired
	private EmailService emailService;
	
	private ProductVo pvo=new ProductVo();
	
	private UserVo uvo=new UserVo();
	
	@RequestMapping("/main")
	public String main() {

		return "Main";
	}
	@ResponseBody
	@RequestMapping("/logincheke")
	public String login() {
		
		
		return "로그인 성공";
	}
	@ResponseBody
	@RequestMapping("/signup")
	public String signup(@RequestParam(required=false)UserVo uvo){
		String result="";
		if(uvo!=null) {
		int n=um.signup(uvo);
		result="회원가입 성공";
		}else {
			result="회원가입 실패";
		}
		return result;
	}
	@RequestMapping("/registerPD")
	public String registerPD(@RequestParam ProductVo pvo){
		int n=pm.registerPD(pvo);
		return "";
	}
	@RequestMapping("/updatePD")
	public String updatePD() {
		int n=pm.updatePD(pvo);
		return "";
	}
	@ResponseBody
	@PostMapping("/idcheck")
	public String signup(@RequestParam String userId) {
		String result="";
		if(userId.length()<13) {
		int n=um.idcheck(userId);
		if(n==0) {
			result="사용가능한 아이디입니다.";
		}else{
			result="이미 사용중인 아이디입니다.";
		}
		}else {
			result="아이디는 최대 12글자입니다.";
		}
		return result;
	}
	@ResponseBody
	@PostMapping("/sendVerificationEmail")
    public String sendVerificationEmail(@RequestParam("email") String email,HttpServletResponse response) {
        try {
		String verificationToken = TokenGenerator.generateRandomToken();
        emailService.sendEmailVerification(email, verificationToken);
        
        // verificationToken 쿠키 생성
        Cookie tokenCookie = new Cookie("verificationToken", verificationToken);
        tokenCookie.setMaxAge(5 * 60); // 5분 동안 유효
        tokenCookie.setPath("/"); // 모든 경로에서 접근 가능
        response.addCookie(tokenCookie);

        // email 쿠키 생성
        Cookie emailCookie = new Cookie("email", email);
        emailCookie.setMaxAge(5 * 60); // 5분 동안 유효
        emailCookie.setPath("/"); // 모든 경로에서 접근 가능
        response.addCookie(emailCookie);
        
        return "이메일이 성공적으로 전송되었습니다. 확인 메일을 확인하세요.";
        }catch(Exception e) {
        	return 	"이메일 전송 중 오류가 발생했습니다.";
        }
    }
	@ResponseBody
	@GetMapping(value = "/getpd", produces = "application/json; charset=UTF-8")
	public ResponseEntity<List<ProductVo>> getProducts() {
	    try {
	        List<ProductVo> productList = pm.getpd();
	        return new ResponseEntity<>(productList, HttpStatus.OK);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	@ResponseBody
	@PostMapping("/addToCart")
	public void addToCart(@RequestParam int PD_ID, HttpSession session) {
	    // 세션에서 기존 리스트를 가져옵니다.
	    List<ProductVo> cartList = (List<ProductVo>) session.getAttribute("cartList");
	    pvo=pm.selectpd(PD_ID);
	    // 리스트가 없으면 새로 생성합니다.
	    if (cartList == null) {
	        cartList = new ArrayList<>();
	    }

	    // 새 ProductVo를 리스트에 추가합니다.
	    cartList.add(pvo);

	    // 업데이트된 리스트를 다시 세션에 저장합니다.
	    session.setAttribute("cartList", cartList);
	    System.out.println(session.getAttribute("cartList").toString());
	    int cartListSize = cartList.size();
		System.out.println("길이: "+cartListSize);
	}
	@RequestMapping("/cart")
	public String cart(Model model,HttpSession session) {
		List<ProductVo> cartList = (List<ProductVo>) session.getAttribute("cartList");
		if(cartList!=null) {
		model.addAttribute("cartList",(List<ProductVo>)session.getAttribute("cartList"));
				}
		return "Cart";
	}
	@ResponseBody
	@RequestMapping("/clearCart")
	public void clearCart(@RequestParam(required = false) Integer PD_ID, HttpSession session) {
	    if (PD_ID != null) {
	        List<ProductVo> cartList = (List<ProductVo>) session.getAttribute("cartList");

	        // cartList가 null이 아니고 비어있지 않은 경우
	        if (cartList != null && !cartList.isEmpty()) {
	            Iterator<ProductVo> iterator = cartList.iterator();
	            while (iterator.hasNext()) {
	                ProductVo product = iterator.next();
	                if (product.getPD_ID() == PD_ID) {
	                    iterator.remove(); // PD_ID와 일치하는 항목을 제거
	                }
	            }
	            session.setAttribute("cartList", cartList);
	        }
	    } else {
	        session.removeAttribute("cartList");
	    }
	}
}
