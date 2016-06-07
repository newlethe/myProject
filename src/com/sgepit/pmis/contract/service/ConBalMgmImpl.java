package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConBal;
import com.sgepit.pmis.contract.hbm.ConBalNew;
public class ConBalMgmImpl extends BaseMgmImpl implements ConBalMgmFacade {

	private ContractDAO contractDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static ConBalMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConBalMgmImpl) ctx.getBean("conbalMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setContractDAO(ContractDAO contractDAO) {
		this.contractDAO = contractDAO;
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	@SuppressWarnings("unchecked")
	public String insertConbal(ConBal conbal) throws SQLException, BusinessException {
		String state = "";
		String str = checkValidConbal(conbal);
		if (!str.equals("")){
			state = str;
		}
		this.contractDAO.insert(conbal);
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConBal.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConBal.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		pdd.setPctableuids(conbal.getBalid());
		pdd.setPcurl(DynamicDataUtil.CON_BAL_URL);
		pdd.setPid(conbal.getPid());
		this.contractDAO.insert(pdd);
		List dataList = new ArrayList ();
		dataList.add(conbal);
		dataList.add(pdd);
		String conid = conbal.getConid();
		String afterupdate="update con_ove  o set  o.billstate =3 where o.conid='"+conid+"' and o.pid='"+conbal.getPid()+"'";
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID, conbal.getPid(), "", afterupdate, "新增合同结算");
			dataExchangeService.addExchangeListToQueue(ExchangeList);				
		}
		return state;
	}
	@SuppressWarnings("unchecked")
	public String updateConbal(ConBal conbal) throws SQLException, BusinessException {
		String state = "";
		String str = checkValidConbal(conbal);
		if (!str.equals("")){
			state = str;
		}
		this.contractDAO.saveOrUpdate(conbal);
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConBal.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConBal.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
		pdd.setPctableuids(conbal.getBalid());
		pdd.setPcurl(DynamicDataUtil.CON_BAL_URL);
		pdd.setPid(conbal.getPid());
		this.contractDAO.insert(pdd);
		List dataList = new ArrayList ();
		dataList.add(conbal);
		dataList.add(pdd);
		//查寻是否有数据交互的PID
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID, conbal.getPid(),"","","修改合同结算");
			dataExchangeService.addExchangeListToQueue(ExchangeList);			
		}
		return state;
	}
	/**
	 * 新增合同结算信息（新）
	 * @param conbal
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public String insertConbalNew(ConBalNew conbal) throws SQLException, BusinessException {
		String state = "";
		try{
			conbal.setBillState("1");
			this.contractDAO.insert(conbal);
			PcDynamicData  pdd= new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(ConBal.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConBal.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd.setPctableuids(conbal.getUids());
			pdd.setPcurl(DynamicDataUtil.CON_BAL_URL);
			pdd.setPid(conbal.getPid());
			this.contractDAO.insert(pdd);
			List dataList = new ArrayList ();
			dataList.add(conbal);
			dataList.add(pdd);
			String conid = conbal.getConid();
			String afterupdate="update con_ove  o set  o.billstate =3 where o.conid='"+conid+"' and o.pid='"+conbal.getPid()+"'";
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID, conbal.getPid(), "", afterupdate, "新增合同结算");
				dataExchangeService.addExchangeListToQueue(ExchangeList);				
			}
			return state;
		}catch (Exception e) {
			e.printStackTrace();
			return state = "false";
		}
		
	}
	/**
	 * 修改合同结算信息（新）
	 * @param conbal
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public String updateConbalNew(ConBalNew conbal) throws SQLException, BusinessException {
		String state = "";
		try {
			conbal.setBillState("1");
			this.contractDAO.saveOrUpdate(conbal);
			PcDynamicData  pdd= new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(ConBal.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConBal.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
			pdd.setPctableuids(conbal.getUids());
			pdd.setPcurl(DynamicDataUtil.CON_BAL_URL);
			pdd.setPid(conbal.getPid());
			this.contractDAO.insert(pdd);
			List dataList = new ArrayList ();
			dataList.add(conbal);
			dataList.add(pdd);
			//查寻是否有数据交互的PID
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID, conbal.getPid(),"","","修改合同结算");
				dataExchangeService.addExchangeListToQueue(ExchangeList);			
			}
			return state;
		} catch (Exception e) {
			e.printStackTrace();
			return state="false";
		}
		
	}
	/**
	 * 删除合同结算信息（新）
	 * @param conbal
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public String deleteConbalNew(String uids) throws SQLException, BusinessException {
		String state = "";
		try {
			ConBalNew conBal = (ConBalNew) contractDAO.findById(ConBalNew.class.getName(), uids);
			this.contractDAO.delete(conBal);
			return state;
		} catch (Exception e) {
			e.printStackTrace();
			return state="false";
		}
		
	}
	private String checkValidConbal(ConBal conbal) {
		StringBuffer msg = new StringBuffer("");
		//项目编号不能为空
		if (conbal.getPid() == null || conbal.getPid().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_PID_IS_NULL));
			msg.append("<br>");
			
		}
		return msg.toString();
	}

}
