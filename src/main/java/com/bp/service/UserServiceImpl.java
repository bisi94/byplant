package com.bp.service;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.bp.mapper.UserMapper;
import com.bp.model.UserVo;

@Service("UserService")
public class UserServiceImpl implements UserService {
	
	@Inject
	UserMapper umapper;

	@Override
	public int signup(UserVo uvo) {
		
		return this.umapper.signup(uvo);
	}

	@Override
	public int idcheck(String userId) {
		return this.umapper.idcheck(userId);
	}

}
