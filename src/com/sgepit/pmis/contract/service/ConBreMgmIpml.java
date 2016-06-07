package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConBre;

public class ConBreMgmIpml extends BaseMgmImpl implements ConBreMgmFacade {

	private ContractDAO contractDAO;
	private String beanName = BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_BRE);

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static ConBreMgmIpml getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConBreMgmIpml) ctx.getBean("conbreMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setContractDAO(ContractDAO contractDAO) {
		this.contractDAO = contractDAO;
	}

	@SuppressWarnings("all")
	public void insertConbre(ConBre conbre) throws SQLException, BusinessException {
		String str = checkValidConbre(conbre);
		if (!str.equals("")){
			throw new SQLException(str);
		}
		if (!checkUniqueConbre(conbre)){
			throw new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE);
		}
		this.contractDAO.insert(conbre);
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConBre.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConBre.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		pdd.setPctableuids(conbre.getBreid());
		pdd.setPcurl(DynamicDataUtil.CON_BRE_URL);
		pdd.setPid(conbre.getPid());
		this.contractDAO.insert(pdd);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			List dataList = new ArrayList();
			dataList.add(conbre);
			dataList.add(pdd);
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID, conbre.getPid(), "", "", "新增合同违约");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
	}
	
	@SuppressWarnings("all")
	public void updateConbre(ConBre conbre) throws SQLException, BusinessException {
		this.contractDAO.saveOrUpdate(conbre);
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConBre.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConBre.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
		pdd.setPctableuids(conbre.getBreid());
		pdd.setPcurl(DynamicDataUtil.CON_BRE_URL);
		pdd.setPid(conbre.getPid());
		this.contractDAO.insert(pdd);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			List dataList = new ArrayList();
			dataList.add(conbre);
			dataList.add(pdd);
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,conbre.getPid(), "", "", "修改合同违约");
			dataExchangeService.addExchangeListToQueue(ExchangeList);				
		}
	}
	
	private String checkValidConbre(ConBre conbre) {
		StringBuffer msg = new StringBuffer("");
		//项目编号不能为空
		if (conbre.getPid() == null || conbre.getPid().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_PID_IS_NULL));
			msg.append("<br>");
			
		}
		if (conbre.getBrework() == null || conbre.getBrework().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_BREWORK_IS_NOT_NULL));
			msg.append("<br>");	
		}		
		//检查数据是否唯一
		String where = " pid = '" + conbre.getPid() + "' and breid='" + conbre.getBreid() + "'  and conid <> '" + conbre.getConid() + "'";;
		List list = this.contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_BRE), where);		
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}
		return msg.toString();
	}
	
	private boolean checkUniqueConbre(ConBre conbre) {
		String where = " pid = '" + conbre.getPid() + "' and breid='" + conbre.getBreid() + "'";
		List list = this.contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_BRE), where);
		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	@SuppressWarnings("all")
	public String deleteConbre(String breid,String modId) throws SQLException,BusinessException {
		String flag = "0";
		try {
			ConBre conBre = (ConBre)this.contractDAO.findById(beanName, breid);
			String bean = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_BREACH_APP;
			List bdgBre_list = this.contractDAO.findByProperty(bean, "conid", conBre.getConid());
			if(bdgBre_list != null && bdgBre_list.size()>0){
				return flag = "已存在概算违约记录，不能删除！";
			}
			HttpSession  session =WebContextFactory.get().getSession();
			String pid=(String)session.getAttribute(Constant.CURRENTAPPPID);
			SystemMgmFacade systemMgmFacade  =(SystemMgmFacade)Constant.wact.getBean("systemMgm");
			String rtn=systemMgmFacade.getFlowType(pid, modId);
			//通过返回状态判断
			if("BusinessProcess".equals(rtn)&&conBre.getBillstate()!=0){
				return flag ="系统流程审批后的变更记录,不能删除!";
			}
			this.contractDAO.delete(conBre);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				List dataList = new ArrayList();
				dataList.add(conBre);
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID, conBre.getPid(), "", "", "删除合同违约");
				dataExchangeService.addExchangeListToQueue(ExchangeList);			
			}
		} catch (RuntimeException e) {
			flag = "-1";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	public Double getBreachappmoney(String conid, String parent, String breid)
	throws SQLException, BusinessException {
		String sql="select nvl(sum(nvl(breachapp.appmoney,0)),0) breachappmoney from bdg_breach_app breachapp,bdg_money_app bdgmoneyapp where " +
		"breachapp.conid=bdgmoneyapp.conid and breachapp.pid=bdgmoneyapp.pid and breachapp.bdgid=bdgmoneyapp.bdgid and " +
		"breachapp.conid='"+conid+"' and breachapp.breappno='"+breid+"' and bdgmoneyapp.parent='0'";
		System.out.println("sql:**"+sql);
		Double breachappmoney=0.0;
		List list =this.contractDAO.getDataAutoCloseSes(sql);
		if(list!=null&&list.size()>0){
			Object o =list.get(0);
			breachappmoney=Double.parseDouble(o.toString());
			}

		return breachappmoney;
	}	
}
