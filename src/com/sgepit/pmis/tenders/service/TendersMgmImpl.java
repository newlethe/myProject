package com.sgepit.pmis.tenders.service;

import java.sql.SQLException;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.tenders.dao.TendersDAO;
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

public class TendersMgmImpl extends BaseMgmImpl implements TendersMgmFacade{
	
	private static final Log log = LogFactory.getLog(BaseMgmImpl.class);
	
	private TendersDAO tendersDAO;
	//private BaseDao baseDao;
	
	//private BusinessException businessException;
	//private Object[][] object;


	//-------------------------------------------------------------------------
	// Return business logic instance
	//-------------------------------------------------------------------------
	public static TendersMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (TendersMgmImpl) ctx.getBean("tendersMgm");
	}	
	
	//-------------------------------------------------------------------------
	// Setter methods for dependency injection
	//-------------------------------------------------------------------------
	public void setTendersDAO(TendersDAO tendersDAO) {
		this.tendersDAO = tendersDAO;
	}
	
	//-------------------------------------------------------------------------
	// Operation methods, implementing the TenderMgmFacade interface
	//-------------------------------------------------------------------------
	public void insertZbBasic(ZbBasic zbBasic) throws SQLException, BusinessException {
		String str = checkValidZbBasic(zbBasic);
		if (!str.equals("")){
			throw new SQLException(str);
		}
		/*if (!checkUniqueZbBasic(zbBasic)){
			throw new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE);
		}*/
		this.tendersDAO.insert(zbBasic);
	}
	
	public void updateZbBasic(ZbBasic zbBasic) throws SQLException, BusinessException {
		/*String str = checkValidZbBasic(zbBasic);
		if (!str.equals("")){
			throw new SQLException(str);
		}*/
		this.tendersDAO.saveOrUpdate(zbBasic);
	}
	
	private boolean checkUniqueZbBasic(ZbBasic zbBasic) {
		String where = "tenid = '"+ zbBasic.getTenid() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Tend_ZBBASIC), where);

		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	private String checkValidZbBasic(ZbBasic zbBasic) {
		StringBuffer msg = new StringBuffer("");
		//id号不允许为空
		if (zbBasic.getTenid() == null || zbBasic.getTenno().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_TendPro_ID_IS_NULL));
			msg.append("<br>");
			
		}
		//名称不能为空
		if (zbBasic.getTenname() == null || zbBasic.getTenname().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_TendPro_Name_IS_NULL));
			msg.append("<br>");	
		}
		
		String where = "tenid = '"+ zbBasic.getTenid() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Tend_ZBBASIC), where);
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_TendPro_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}		
		
		return msg.toString();
	}	
	
	
//	------------------------------------------------------------------
	public List getAllZbBasic() throws SQLException, BusinessException{		
		return this.tendersDAO.findOrderBy2(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Tend_ZBBASIC), "tenid");		
	}
	
	public void insertPbasic(Pbasic pbasic) throws SQLException, BusinessException {	}
	public void updatePbasic(Pbasic pbasic) throws SQLException, BusinessException {	}
	
	public void insertZbJh(ZbJh zbJh) throws SQLException, BusinessException {	}
	public void updateZbJh(ZbJh zbJh) throws SQLException, BusinessException {	}
	
	public void insertZbPw(ZbPw zbPw) throws SQLException, BusinessException {	}
	public void updateZbPw(ZbPw zbPw) throws SQLException, BusinessException {	}
	
	public void insertZbRck(ZbRck zbRck) throws SQLException, BusinessException {	}
	public void updateZbRck(ZbRck zbRck) throws SQLException, BusinessException {	}
	
	public void insertZbTbdw(ZbTbdw zbTbdw) throws SQLException, BusinessException {	}
	public void updateZbTbdw(ZbTbdw zbTbdw) throws SQLException, BusinessException {	}
	
	public void insertZbWyh(ZbWyh zbWyh) throws SQLException, BusinessException {	}
	public void updateZbWyh(ZbWyh zbWyhs) throws SQLException, BusinessException {	}
	
		
	public void insertTenAbi(TenAbi tenAbi) throws SQLException, BusinessException {
		String str = checkValidTenAbi(tenAbi);
		if (!str.equals("")){
			throw new SQLException(str);
		}
		/*if (!checkUniqueTenAbi(tenAbi)){
			throw new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE);
		}*/
		this.tendersDAO.insert(tenAbi);
	}
	
	private boolean checkUniqueTenAbi(TenAbi tenAbi) {
		String where = "pid = '"+ tenAbi.getPid() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_ABI), where);

		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	private String checkValidTenAbi(TenAbi tenAbi) {
		StringBuffer msg = new StringBuffer("");
		//id号不允许为空
		if (tenAbi.getPeoid() == null || tenAbi.getPeono().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_ID_IS_NULL));
			msg.append("<br>");
			
		}
		//名称不能为空
		if (tenAbi.getPeoname() == null || tenAbi.getPeoname().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_NAME_IS_NULL));
			msg.append("<br>");	
		}
		
		String where = "peono = '"+ tenAbi.getPeono() +"' and peoname = '"+ tenAbi.getPeoname().trim() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_ABI), where);
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}		
		
		return msg.toString();
	}	
	
	public void updateTenAbi(TenAbi tenAbi) throws SQLException, BusinessException {
		this.tendersDAO.saveOrUpdate(tenAbi);
	}
	
	public void insertTenCom(TenCom tenCom) throws SQLException, BusinessException {
		String str = checkValidTenCom(tenCom);
		if (!str.equals("")){
			throw new SQLException(str);
		}
		/*if (!checkUniqueTenCom(tenCom)){
			throw new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE);
		}*/
		this.tendersDAO.insert(tenCom);
	}
	private boolean checkUniqueTenCom(TenCom tenCom) {
		String where = "pid = '"+ tenCom.getPid() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_COM), where);

		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	private String checkValidTenCom(TenCom tenCom) {
		StringBuffer msg = new StringBuffer("");
		//id号不允许为空
		if (tenCom.getComid() == null || tenCom.getComno().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_ID_IS_NULL));
			msg.append("<br>");
			
		}
//		名称不能为空
		if (tenCom.getComname() == null || tenCom.getComname().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_NAME_IS_NULL));
			msg.append("<br>");	
		}
		String where = "comno = '"+ tenCom.getComno() +"' and comname = '"+ tenCom.getComname().trim() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_COM), where);
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}		
		
		return msg.toString();
	}	
	public void updateTenCom(TenCom tenCom) throws SQLException, BusinessException {
		this.tendersDAO.saveOrUpdate(tenCom);
	}
	
	public void insertTenPro(TenPro tenPro) throws SQLException, BusinessException {	}
	public void updateTenPro(TenPro tenPro) throws SQLException, BusinessException {	}
	
	public void insertTenReg(TenReg tenReg) throws SQLException, BusinessException {
		String str = checkValidTenReg(tenReg);
		if (!str.equals("")){
			throw new SQLException(str);
		}
		/*if (!checkUniqueTenReg(tenReg)){
			throw new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE);
		}*/
		this.tendersDAO.insert(tenReg);
	}
	private boolean checkUniqueTenReg(TenReg tenReg) {
		String where = "pid = '"+ tenReg.getPid() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_REG), where);

		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	private String checkValidTenReg(TenReg tenReg) {
		StringBuffer msg = new StringBuffer("");
		//id号不允许为空
		if (tenReg.getRegid() == null || tenReg.getRegno().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_ID_IS_NULL));
			msg.append("<br>");
			
		}		
		
		String where = "regno = '"+ tenReg.getRegno() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_REG), where);
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}		
		
		return msg.toString();
	}	
	public void updateTenReg(TenReg tenReg) throws SQLException, BusinessException {
		this.tendersDAO.saveOrUpdate(tenReg);
	}
	
	public void insertTenSub(TenSub tenSub) throws SQLException, BusinessException {
		String str = checkValidTenSub(tenSub);
		if (!str.equals("")){
			throw new SQLException(str);
		}
		/*if (!checkUniqueTenSub(tenSub)){
			throw new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE);
		}*/
		this.tendersDAO.insert(tenSub);
	}
	public void updateTenSub(TenSub tenSub) throws SQLException, BusinessException {	
		this.tendersDAO.saveOrUpdate(tenSub);
	}
	
	private boolean checkUniqueTenSub(TenSub tebSub) {
		String where = "subno = '"+ tebSub.getSubno() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_SUB), where);

		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	private String checkValidTenSub(TenSub tebSub) {
		StringBuffer msg = new StringBuffer("");
		//id号不允许为空
		if (tebSub.getSubno() == null || tebSub.getSubno().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_TendSub_TenSubNo_IS_NULL));
			msg.append("<br>");
			
		}
		//name不能为空
		if (tebSub.getSubsubname() == null || tebSub.getSubsubname().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_TendSub_TenSubName_IS_NULL));
			msg.append("<br>");	
		}
		
		String where = "subno = '"+ tebSub.getSubno() +"' and subsubname ='"+ tebSub.getSubsubname() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_SUB), where);
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_TendSub_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}		
		
		return msg.toString();
	}	
	
	public void insertTenUni(TenUni tenUni) throws SQLException, BusinessException {
		String str = checkValidTenUni(tenUni);
		if (!str.equals("")){
			throw new SQLException(str);
		}
		/*if (!checkUniqueTenUni(tenUni)){
			throw new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE);
		}*/
		this.tendersDAO.insert(tenUni);
	}
	private boolean checkUniqueTenUni(TenUni tenUni) {
		String where = "pid = '"+ tenUni.getPid() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_UNI), where);

		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	private String checkValidTenUni(TenUni tenUni) {
		StringBuffer msg = new StringBuffer("");
		//id号不允许为空
		if (tenUni.getClepid() == null || tenUni.getCleno().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_ID_IS_NULL));
			msg.append("<br>");
			
		}
		//名称不能为空
		if (tenUni.getClename() == null || tenUni.getClename().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_NAME_IS_NULL));
			msg.append("<br>");	
		}
		
		String where = "cleno = '"+ tenUni.getCleno() +"' and  clename = '"+ tenUni.getClename().trim() +"'";
		List list = this.tendersDAO.findByWhere(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Ten_UNI), where);
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}		
		
		return msg.toString();
	}	
	
	public void updateTenUni(TenUni tenUni) throws SQLException, BusinessException {
		this.tendersDAO.saveOrUpdate(tenUni);
	}
	
	/**
	 * 测试
	 * @param 
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public List getTendersInfo(String tenNo) throws SQLException, BusinessException{	
		ZbBasic zbBasic = (ZbBasic) tendersDAO.findBeanByProperty(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Tend_ZBBASIC), "tenid", tenNo);
		List list = tendersDAO.findByProperty(BusinessConstants.Tend_PACKAGE.concat(BusinessConstants.Tend_ZBBASIC), "tenid", zbBasic.getTenid());
		return list;
	}
	public ZbBasic getFormBeant(String beanId) throws SQLException, BusinessException{
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Tend_ZBBASIC;
		return (ZbBasic)tendersDAO.findById(beanName, beanId); 
	}
	public TenSub getFormBeanSub(String beanId) throws SQLException, BusinessException{
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_SUB;
		return (TenSub)tendersDAO.findById(beanName, beanId); 
	}
	public TenAbi getFormBeanAbi(String beanId) throws SQLException, BusinessException{
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_ABI;
		return (TenAbi)tendersDAO.findById(beanName, beanId); 
	}
	public TenCom getFormBeanCom(String beanId) throws SQLException, BusinessException{
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_COM;
		return (TenCom)tendersDAO.findById(beanName, beanId); 
	}
	public TenReg getFormBeanReg(String beanId) throws SQLException, BusinessException{
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_REG;
		return (TenReg)tendersDAO.findById(beanName, beanId); 
	}
	public TenUni getFormBeanUni(String beanId) throws SQLException, BusinessException{
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_UNI;
		return (TenUni)tendersDAO.findById(beanName, beanId); 
	}
	
		
	public int delZbBasic(String beanId){
		int flag = 0;
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Tend_ZBBASIC;
		ZbBasic zbBasic = (ZbBasic)tendersDAO.findById(beanName, beanId);
 		// tendersDAO.delete(zbBasic); 
 		try {
 			 tendersDAO.delete(zbBasic); 
		} catch (Exception e) {
			flag = 1; e.printStackTrace();
		}
 		return flag;
	}
	
	public int delTenAbi(String beanId){
		int flag = 0;
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_ABI;
		TenAbi tenAbi = (TenAbi)tendersDAO.findById(beanName, beanId);
 		// tendersDAO.delete(zbBasic); 
 		try {
 			 tendersDAO.delete(tenAbi); 
		} catch (Exception e) {
			flag = 1; e.printStackTrace();
		}
 		return flag;
	}
	
	public int delTenCom(String beanId){
		int flag = 0;
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_COM;
		TenCom tenCom = (TenCom)tendersDAO.findById(beanName, beanId);
 		// tendersDAO.delete(zbBasic); 
 		try {
 			 tendersDAO.delete(tenCom); 
		} catch (Exception e) {
			flag = 1; e.printStackTrace();
		}
 		return flag;
	}
	
	public int delTenReg(String beanId){
		int flag = 0;
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_REG;
		TenReg tenReg = (TenReg)tendersDAO.findById(beanName, beanId);
 		// tendersDAO.delete(zbBasic); 
 		try {
 			 tendersDAO.delete(tenReg); 
		} catch (Exception e) {
			flag = 1; e.printStackTrace();
		}
 		return flag;
	}
	
	public int delTenSub(String beanId){
		int flag = 0;
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_SUB;
		TenSub tenSub = (TenSub)tendersDAO.findById(beanName, beanId);
 		// tendersDAO.delete(zbBasic); 
 		try {
 			 tendersDAO.delete(tenSub); 
		} catch (Exception e) {
			flag = 1; e.printStackTrace();
		}
 		return flag;
	}
	
	public int delTenUni(String beanId){
		int flag = 0;
		String beanName = BusinessConstants.Tend_PACKAGE + BusinessConstants.Ten_UNI;
		TenUni tenUni = (TenUni)tendersDAO.findById(beanName, beanId);
 		try {
 			 tendersDAO.delete(tenUni); 
		} catch (Exception e) {
			flag = 1; e.printStackTrace();
		}
 		return flag;
	}
	
	
	public int insertOrUpdate(ZbBasic zbBasic){
		int flag = 0;
		try {
			if ("".equals(zbBasic.getTenid())){
				this.insertZbBasic(zbBasic);
			}else{
				this.updateZbBasic(zbBasic);
			}
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	public int insertOrUpd(TenAbi tenAbi){
		int flag = 0;
		try {
			if ("".equals(tenAbi.getPeoid())){
				this.insertTenAbi(tenAbi);
			}else{
				this.updateTenAbi(tenAbi);
			}
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	public int instOrUpd(TenSub tenSub){
		int flag = 0;
		try {
			if ("".equals(tenSub.getSubid())){
				this.insertTenSub(tenSub);
			}else{
				this.updateTenSub(tenSub);
			}
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	public int instOrUpdCom(TenCom tenCom){
		int flag = 0;
		try {
			if ("".equals(tenCom.getComid())){
				this.insertTenCom(tenCom);
			}else{
				this.updateTenCom(tenCom);
			}
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	public int instOrUpdReg(TenReg tenReg){
		int flag = 0;
		try {
			if ("".equals(tenReg.getRegid())){
				this.insertTenReg(tenReg);
			}else{
				this.updateTenReg(tenReg);
			}
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	public int instOrUpdUni(TenUni tenUni){
		int flag = 0;
		try {
			if ("".equals(tenUni.getCleid())){
				this.insertTenUni(tenUni);
			}else{
				this.updateTenUni(tenUni);
			}
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	
	
}
