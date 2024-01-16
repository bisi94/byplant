package com.bp.service;

import com.bp.model.UserVo;

public interface UserService {
	
	public int signup(UserVo uvo);
	
	public int idcheck(String userId);

}
