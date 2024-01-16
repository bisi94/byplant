package com.bp.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.bp.model.UserVo;

@Mapper
public interface UserMapper {

	public int signup(UserVo uvo);
	
	public int idcheck(String userId);
}
