package com.sgepit.pmis.material.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.material.hbm.MatCodeApply;
import com.sgepit.pmis.material.hbm.MatFrame;

public class MatCodeAppMgmImpl extends BaseMgmImpl implements MatCodeAppMgmFacade {

	private EquipmentDAO equipmentDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static MatCodeAppMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (MatCodeAppMgmImpl) ctx.getBean("maAppMgm");
	}
	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}
	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	
	public void deleteMcapp(MatCodeApply mcApp) throws SQLException,
		BusinessException {
		this.equipmentDAO.delete(mcApp);
	
	}
	public void insertMcapp(MatCodeApply mcApp) throws SQLException,
		BusinessException {
		this.equipmentDAO.insert(mcApp);
	
	}
	public void updateMcapp(MatCodeApply mcApp) throws SQLException,
		BusinessException {
		String beanFrame = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME);
		String  frameId = mcApp.getFrameId();
		String state = mcApp.getAppState();
		
		if (frameId.length()>0 && "3".equals(state)){
			//String where = " appid='"+ mcApp.getUuid() + "' and parent ='" + frameId + "'";
			String where = " appid='"+ mcApp.getUuid()+"'";
			List list = (List)this.equipmentDAO.findByWhere(beanFrame, where);
			MatFrame matFrame = (MatFrame)list.get(0);
			String Auint = mcApp.getUnit() == null ? "":mcApp.getUnit();
			Double Aprice = mcApp.getPrice() == null ? 0D :mcApp.getPrice();
			String Awarehouse = mcApp.getWarehouse() == null ? "":mcApp.getWarehouse();
			String AwareNo = mcApp.getWareNo() == null ? "":mcApp.getWareNo();
			String Buint = matFrame.getUnit() == null ? "":matFrame.getUnit();
			Double Bprice = matFrame.getPrice() == null ? 0D:matFrame.getPrice();
			String Bwarehouse = matFrame.getWarehouse() == null ? "":matFrame.getWarehouse();
			String BwareNo = matFrame.getWareNo() == null ? "":matFrame.getWareNo();
			
			if (!Auint.equals(Buint)) matFrame.setUnit( Auint); 
			if (!Aprice.equals(Bprice)) matFrame.setPrice(Aprice); 
			if (!Awarehouse.equals(Bwarehouse)) matFrame.setWarehouse(Awarehouse);
			if (!AwareNo.equals(BwareNo)) matFrame.setWareNo(AwareNo);
			
			this.equipmentDAO.saveOrUpdate(matFrame);
		}
		this.equipmentDAO.saveOrUpdate(mcApp);
	
	}

	//---------------------------------------------------------------------------------------------------
	//	user  method  
	//---------------------------------------------------------------------------------------------------
	
	/**
	 * 物资编码确认
	 */
	public void approveMatNo(String[] frameIds, String[] appIds){
		for (int i=0; i<frameIds.length; i++){
			String beanFrame = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME);
			String beanApp =  BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_CODE_APPLY);
			String where = " appid ='" + appIds[i] + "' and parent ='"+ frameIds[i] +"'";
			List list = (List)this.equipmentDAO.findByWhere(beanFrame, where);
			if (list.size() > 0){
				continue;
			}
			MatFrame matFrame = (MatFrame)this.equipmentDAO.findById(beanFrame, frameIds[i]);
			MatCodeApply mcApp = (MatCodeApply)this.equipmentDAO.findById(beanApp, appIds[i]);
			String catNo = (this.getIndexId(frameIds[i]));
			
			mcApp.setAppState("3");
			mcApp.setCatNo(catNo);
			this.equipmentDAO.saveOrUpdate(mcApp);
			
			MatFrame matNew = new MatFrame();
			if (matFrame.getIsleaf() != 0){
				matFrame.setIsleaf(0L);
			}
			matNew.setAppid(appIds[i]);
			matNew.setCatName(mcApp.getCatname());
			matNew.setCatNo(catNo);
			matNew.setEnName(mcApp.getEnName());
			matNew.setSpec(mcApp.getSpec());
			matNew.setUnit(mcApp.getUnit());
			matNew.setPrice(mcApp.getPrice());
			matNew.setWarehouse(mcApp.getWarehouse());
			matNew.setWareNo(mcApp.getWareNo());
			matNew.setParent(frameIds[i]);
			matNew.setIsleaf(1L);
			this.equipmentDAO.insert(matNew);
		}
		
	}
	
	/**
	 * 获得材料编码
	 * @param frameId
	 * @return
	 */
	public String getIndexId(String frameId){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME);
		StringBuffer  sb = new StringBuffer();
		MatFrame matFrame = (MatFrame)this.equipmentDAO .findById(beanName, frameId);
		sb.append(matFrame.getCatNo());
		JdbcTemplate jdbc =  JdbcUtil.getJdbcTemplate();
		String sql = " select lpad(nvl(max(TO_NUMBER (substr(t.cat_no, length(t.cat_no)-3, length(t.cat_no)))),0) + 1,4,0) indexid  " + 
					 "	from mat_frame t where t.parent = '"+ frameId +"' " ;
		String indexId = (String)jdbc.queryForObject(sql, String.class);
		return sb.append(indexId).toString();
	}
	
	/**
	 * 材料编码发出申请
	 * @param appIds
	 */
	public int applyMatno(String[] appIds){
		int flag = 1;
		String beanApp =  BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_CODE_APPLY);
		for (int i=0; i<appIds.length; i++){
			MatCodeApply mcApp = (MatCodeApply)this.equipmentDAO.findById(beanApp, appIds[i]);
			if (mcApp.getAppState().equals("1")){
				mcApp.setAppState("2");
				flag = 2;
			}
			this.equipmentDAO.saveOrUpdate(mcApp);
		}
		return flag;
	}
	
	
}

