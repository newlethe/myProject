package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConCha;
import com.sgepit.pmis.contract.hbm.ConOve;

public class ConChaMgmImpl extends BaseMgmImpl implements ConChaMgmFacade {

	private ContractDAO contractDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static ConChaMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConChaMgmImpl) ctx.getBean("conchaMgm");
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
	@SuppressWarnings("all")
	public void insertConcha(ConCha concha) throws SQLException, BusinessException {
		this.contractDAO.insert(concha);
		List conList = new ArrayList();
		conList.add(concha);
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConCha.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConCha.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		pdd.setPctableuids(concha.getChaid());
		pdd.setPcurl(DynamicDataUtil.CON_CHANGE_URL);
		pdd.setPid(concha.getPid());
		this.contractDAO.insert(pdd);
		conList.add(pdd);
		List ls2 = contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_CHA),
				"conid = '"+concha.getConid()+"' and billstate = 1");
		ConOve conove = (ConOve)contractDAO.findById(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), concha.getConid());
		StringBuilder stringBuilder = new StringBuilder("update con_ove  o set o.is_change='");
		if(ls2.size() > 0)
		{
			stringBuilder.append("是");
			
		}else{
			stringBuilder.append("");
		}
		stringBuilder.append("' where o.conid='"+conove.getConid()+"' and o.pid='"+conove.getPid()+"'");
		this.contractDAO.saveOrUpdate(conove);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			//获取PCDataExchangeService实例
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID, concha.getPid(), "", stringBuilder.toString(),"新增合同变更");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
	}
	
	@SuppressWarnings("all")
	public void updateConcha(ConCha concha) throws SQLException, BusinessException {
		this.contractDAO.saveOrUpdate(concha);
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConCha.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConCha.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		pdd.setPctableuids(concha.getChaid());
		pdd.setPcurl(DynamicDataUtil.CON_CHANGE_URL);
		pdd.setPid(concha.getPid());
		this.contractDAO.insert(pdd);		
		List conList = new ArrayList();
		conList.add(concha);
		conList.add(pdd);
		List ls2 = contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_CHA),
				"conid = '"+concha.getConid()+"' and billstate = 1");
		ConOve conove = (ConOve)contractDAO.findById(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), concha.getConid());
		StringBuilder stringBuilder = new StringBuilder("update con_ove  o set o.is_change='");
		if(ls2.size() > 0)
		{
			stringBuilder.append("是");
			
		}else{
			stringBuilder.append("");
		}
		stringBuilder.append("' where o.conid='"+conove.getConid()+"' and o.pid='"+conove.getPid()+"'");
		this.contractDAO.saveOrUpdate(conove);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			//获取PCDataExchangeService实例
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID,concha.getPid(),"",stringBuilder.toString(),"修改合同变更");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
	}
	
	public void deleteConcha(ConCha concha) throws SQLException, BusinessException {
		this.contractDAO.delete(concha);
		List conList = new ArrayList();
		conList.add(concha);
		List ls2 = contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_CHA),
				"conid = '"+concha.getConid()+"' and billstate = 1");
		ConOve conove = (ConOve)contractDAO.findById(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), concha.getConid());
		StringBuilder stringBuilder = new StringBuilder("update con_ove  o set o.is_change='");
		if(ls2.size() > 0)
		{
			stringBuilder.append("是");
			
		}else{
			stringBuilder.append("");
		}
		stringBuilder.append("' where o.conid='"+conove.getConid()+"' and o.pid='"+conove.getPid()+"'");
		this.contractDAO.saveOrUpdate(conove);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			//获取PCDataExchangeService实例
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID,concha.getPid(),"",stringBuilder.toString(),"删除合同变更");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
	}
	
	@SuppressWarnings("all")
	public String delConcha(String beanId,String modId){
		String flag = "0";
		try {
			String beanName = BusinessConstants.CON_PACKAGE + BusinessConstants.CON_CHA;
			ConCha concha = (ConCha)contractDAO.findById(beanName, beanId);
			String bean = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_CHANG_APP;
			List bdgCha_list = this.contractDAO.findByProperty(bean, "conid", concha.getConid());
			if (bdgCha_list != null && bdgCha_list.size() > 0){
				return flag = "已存在概算变更记录，不能删除！";
			}
			HttpSession  session =WebContextFactory.get().getSession();
			String pid=(String)session.getAttribute(Constant.CURRENTAPPPID);
			SystemMgmFacade systemMgmFacade  =(SystemMgmFacade)Constant.wact.getBean("systemMgm");
			String rtn=systemMgmFacade.getFlowType(pid, modId);
			//通过返回状态判断
			if("BusinessProcess".equals(rtn)&&concha.getBillstate()!=0){
				return flag ="系统流程审批后的变更记录,不能删除!";
			}
	 		this.contractDAO.delete(concha); 
			List conList = new ArrayList();
			conList.add(concha);
			List ls2 = contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_CHA),
					"conid = '"+concha.getConid()+"' and billstate = 1");
			ConOve conove = (ConOve)contractDAO.findById(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), concha.getConid());
			StringBuilder stringBuilder = new StringBuilder("update con_ove  o set o.is_change='");
			if(ls2.size() > 0)
			{
				stringBuilder.append("是");
				
			}else{
				stringBuilder.append("");
			}
			stringBuilder.append("' where o.conid='"+conove.getConid()+"' and o.pid='"+conove.getPid()+"'");
			this.contractDAO.saveOrUpdate(conove);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID,concha.getPid(),"",stringBuilder.toString(),"删除合同变更");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	 		
			}
		} catch (Exception e) {
			flag = "1"; 
			e.printStackTrace();
			return flag;
		}
 		return flag;
	}
	
	
	
	private boolean checkUniqueConcha(ConCha concha) {
		String where = " pid = '" + concha.getPid() + "' and chaid='" + concha.getChaid() + "'";
		List list = this.contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_CHA), where);
		if (list.size() > 0) {
			return false;
		}
		return true;
	}
	
	public ConCha getConCha(String beanId) throws SQLException, BusinessException{
		String beanName = BusinessConstants.CON_PACKAGE + BusinessConstants.CON_CHA;
		return (ConCha)contractDAO.findById(beanName, beanId); 
	}
	public int instorupdConcha(ConCha concha){
		int flag = 0;
		try {
			if ("".equals(concha.getChaid())){
				this.insertConcha(concha);
			}else{
				this.updateConcha(concha);
				flag=1;
			}
		} catch (SQLException e) {
			flag = 2; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 2; e.printStackTrace();
		}
		return flag;
	}
	public int instConCha(ConCha concha){
		int flag = 0;
		try {
				this.insertConcha(concha);
		} catch (SQLException e) {
			flag = 2; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 2; e.printStackTrace();
		}
		return flag;
	}
	public int updConCha(ConCha concha){
		int flag = 0;
		try {
				this.updateConcha(concha);
				flag=1;
		} catch (SQLException e) {
			flag = 2; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 2; e.printStackTrace();
		}
		return flag;
	}

	public String autoChaNo(String conno){
		String maxNum = null;
		String sql = "select max(substr(chano, -2)) from con_cha where chano like 'BG-"+conno+"-%' ";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		maxNum = (String)jdbc.queryForObject(sql, String.class);
		
		NumberFormat numformat = NumberFormat.getInstance(Locale.CHINESE);
		numformat.setMinimumIntegerDigits(2);
		
		return "BG-"+conno+"-"
			+(maxNum == null ? "01" : numformat.format(Integer.valueOf(maxNum)+1));
	}
	public Double getChangeappmoney(String conid, String parent, String chaid)
	throws SQLException, BusinessException {
		String sql="select nvl(sum(nvl(chapp.camoney,0)),0) changeappmoney from bdg_chang_app chapp,bdg_money_app bdgmoneyapp where " +
		"chapp.conid=bdgmoneyapp.conid and chapp.pid=bdgmoneyapp.pid and chapp.bdgid=bdgmoneyapp.bdgid and " +
		"chapp.conid='"+conid+"' and chapp.cano='"+chaid+"' and bdgmoneyapp.parent='0'";
		System.out.println("sql:**"+sql);
		Double changeappmoney=0.0;
		List list =this.contractDAO.getDataAutoCloseSes(sql);
		if(list!=null&&list.size()>0){
			Object o =list.get(0);
			changeappmoney=Double.parseDouble(o.toString());
			}

		return changeappmoney;
	}
}
