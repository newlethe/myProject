package com.sgepit.pmis.tenders.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.tenders.hbm.Pbasic;
import com.sgepit.pmis.tenders.hbm.TenAbi;
import com.sgepit.pmis.tenders.hbm.TenCom;
import com.sgepit.pmis.tenders.hbm.TenPro;
import com.sgepit.pmis.tenders.hbm.TenReg;
import com.sgepit.pmis.tenders.hbm.TenSub;
import com.sgepit.pmis.tenders.hbm.TenUni;
import com.sgepit.pmis.tenders.hbm.ZbBasic;
import com.sgepit.pmis.tenders.hbm.ZbJh;
import com.sgepit.pmis.tenders.hbm.ZbPw;
import com.sgepit.pmis.tenders.hbm.ZbRck;
import com.sgepit.pmis.tenders.hbm.ZbTbdw;
import com.sgepit.pmis.tenders.hbm.ZbWyh;

/**
 * @TendersMgmFacade 合同管理业务逻辑接口
 * @author Lifan
 */
public interface TendersMgmFacade {
	
	void insertPbasic(Pbasic pbasic) throws SQLException, BusinessException;
	void updatePbasic(Pbasic pbasic) throws SQLException, BusinessException;
	
	void insertZbBasic(ZbBasic zbBasic) throws SQLException, BusinessException;
	void updateZbBasic(ZbBasic zbBasic) throws SQLException, BusinessException;
	
	void insertZbJh(ZbJh zbJh) throws SQLException, BusinessException;
	void updateZbJh(ZbJh zbJh) throws SQLException, BusinessException;
	
	void insertZbPw(ZbPw zbPw) throws SQLException, BusinessException;
	void updateZbPw(ZbPw zbPw) throws SQLException, BusinessException;
	
	void insertZbRck(ZbRck zbRck) throws SQLException, BusinessException;
	void updateZbRck(ZbRck zbRck) throws SQLException, BusinessException;
	
	void insertZbTbdw(ZbTbdw zbTbdw) throws SQLException, BusinessException;
	void updateZbTbdw(ZbTbdw zbTbdw) throws SQLException, BusinessException;
	
	void insertZbWyh(ZbWyh zbWyh) throws SQLException, BusinessException;
	void updateZbWyh(ZbWyh zbWyh) throws SQLException, BusinessException;
	
	
	
	
	void insertTenAbi(TenAbi tenAbi) throws SQLException, BusinessException;
	void updateTenAbi(TenAbi tenAbi) throws SQLException, BusinessException;
	
	void insertTenCom(TenCom tenCom) throws SQLException, BusinessException;
	void updateTenCom(TenCom tenCom) throws SQLException, BusinessException;
	
	void insertTenPro(TenPro tenPro) throws SQLException, BusinessException;
	void updateTenPro(TenPro tenPro) throws SQLException, BusinessException;
	
	void insertTenReg(TenReg tenReg) throws SQLException, BusinessException;
	void updateTenReg(TenReg tenReg) throws SQLException, BusinessException;
	
	void insertTenSub(TenSub tebSub) throws SQLException, BusinessException;
	void updateTenSub(TenSub tebSub) throws SQLException, BusinessException;
	
	void insertTenUni(TenUni tenUni) throws SQLException, BusinessException;
	void updateTenUni(TenUni tenUni) throws SQLException, BusinessException;
	
	/**
	 * 获得所有招标信息
	 * @return
	 * @throws BusinessException 
	 * @throws SQLException 
	 */
	List getAllZbBasic() throws SQLException, BusinessException;
	
	/**
	 * 测试
	 * @param conModel
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	List getTendersInfo(String conModel) throws SQLException, BusinessException;
	public int delTenAbi(String beanId);
	public int delTenCom(String beanId);
	public int delTenReg(String beanId);
	public int delTenSub(String beanId);
	public int delTenUni(String beanId);
	public int delZbBasic(String beanId);
	public TenAbi getFormBeanAbi(String beanId) throws SQLException, BusinessException;
	public TenCom getFormBeanCom(String beanId) throws SQLException, BusinessException;
	public TenReg getFormBeanReg(String beanId) throws SQLException, BusinessException;
	public TenSub getFormBeanSub(String beanId) throws SQLException, BusinessException;
	public ZbBasic getFormBeant(String beanId) throws SQLException, BusinessException;
	public TenUni getFormBeanUni(String beanId) throws SQLException, BusinessException;
	public int insertOrUpd(TenAbi tenAbi);
	public int insertOrUpdate(ZbBasic zbBasic);
	public int instOrUpd(TenSub tenSub);
	public int instOrUpdCom(TenCom tenCom);
	public int instOrUpdReg(TenReg tenReg);
	public int instOrUpdUni(TenUni tenUni);

		
		
		
	
	
}
