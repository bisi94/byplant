package com.bp.service;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.bp.mapper.ProductMapper;
import com.bp.model.ProductVo;

@Service("ProductService")
public class ProductServiceImpl implements ProductService {

	@Inject
	private ProductMapper pmapper;
	
	@Override
	public int registerPD(ProductVo pvo) {
		return this.pmapper.registerPD(pvo);
	}

	@Override
	public int updatePD(ProductVo pvo) {
		return this.pmapper.updatePD(pvo);
	}

	@Override
	public List<ProductVo> getpd() {
		return this.pmapper.getpd();
	}

	@Override
	public ProductVo selectpd(int PD_ID) {
		return this.pmapper.selectpd(PD_ID);
	}

}
