package com.bp.service;

import java.util.List;

import com.bp.model.ProductVo;

public interface ProductService {
	
	public int registerPD(ProductVo pvo);
	
	public int updatePD(ProductVo pvo);
	
	public List<ProductVo> getpd();
	
	public ProductVo selectpd(int PD_ID);

}
