package com.bp.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.bp.model.ProductVo;

@Mapper
public interface ProductMapper {

	public int registerPD(ProductVo pvo);
	
	public int updatePD(ProductVo pvo);
	
	public List<ProductVo> getpd();
	
	public ProductVo selectpd(int PD_ID);
}
