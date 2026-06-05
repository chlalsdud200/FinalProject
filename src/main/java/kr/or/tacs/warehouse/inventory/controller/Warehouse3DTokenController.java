package kr.or.tacs.warehouse.inventory.controller;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.common.util.TokenProvider;
import kr.or.tacs.vo.common.AuthUserVO;
import kr.or.tacs.vo.common.CustomUser;

@RestController
@RequestMapping("/warehouse/api/3d")
public class Warehouse3DTokenController {

	@Autowired
	private TokenProvider tokenProvider;
	
	@GetMapping("/token.do")
	public Map<String, Object> issue3DToken(){
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUser user = (CustomUser) auth.getPrincipal();
		
		AuthUserVO authUser = new AuthUserVO();
		authUser.setLoginId(user.getLoginId());
		authUser.setRoleCd(user.getRoleCd());
		
		String token = tokenProvider.generateToken(authUser, Duration.ofMinutes(30));
		
		return Map.of("token",token);
	}
}
