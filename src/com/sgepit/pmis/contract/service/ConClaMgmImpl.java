package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.object.SqlQuery;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConCha;
import com.sgepit.pmis.contract.hbm.ConCla;

public class ConClaMgmImpl extends BaseMgmImpl implements ConClaMgmFacade {

	private ContractDAO contractDAO;
	private String beanName = BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_CLA);
	
	public static ConClaMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConClaMgmImpl) ctx.getBean("conclaMgm");
	}

	public void setContractDAO(ContractDAO contractDAO) {
		this.contractDAO = contractDAO;
	}

	@SuppressWarnings("unchecked")
	public int insertConCla(ConCla conCla) throws SQLException, BusinessException {
		int flag = 0;
		try {
			this.contractDAO.insert(conCla);
			PcDynamicData  pdd= new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(ConCha.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConCla.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd.setPctableuids(conCla.getClaid());
			pdd.setPcurl(DynamicDataUtil.CON_CLA_URL);
			pdd.setPid(conCla.getPid());
			this.contractDAO.insert(pdd);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				List dataList = new ArrayList();
				dataList.add(conCla);
				dataList.add(pdd);
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,conCla.getPid(),"","","新增合同索赔");
				dataExchangeService.addExchangeListToQueue(ExchangeList);		
			}
		} catch (Exception e) {
			flag = 2;e.printStackTrace();
		}
		return flag;
	}
	
	@SuppressWarnings("unchecked")
	public int updateConCla(ConCla conCla) throws SQLException, BusinessException {
		 int flag =0;
		try {
			this.contractDAO.saveOrUpdate(conCla);
			PcDynamicData  pdd= new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(ConCla.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConCla.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
			pdd.setPctableuids(conCla.getClaid());
			pdd.setPcurl(DynamicDataUtil.CON_CLA_URL);
			pdd.setPid(conCla.getPid());
			this.contractDAO.insert(pdd);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				List dataList = new ArrayList();
				dataList.add(conCla);
				dataList.add(pdd);
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,conCla.getPid(),"","","修改合同索赔");
				dataExchangeService.addExchangeListToQueue(ExchangeList);			
			}
		} catch (Exception e) {
			flag=1;
			e.printStackTrace();
		}
		return flag;
	}

	@SuppressWarnings("unchecked")
	public String deleteConCla(String claid,String modId) throws SQLException, BusinessException {
		String flag = "0";
		try {
			ConCla conCla = (ConCla)this.contractDAO.findById(beanName, claid);
			String bean = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_COMPENSATE_APP;
			List bdgCla_list = this.contractDAO.findByProperty(bean, "conid", conCla.getConid());
			if(bdgCla_list != null && bdgCla_list.size()>0){
				return flag = "已存在概算索赔记录，不能删除！";
			}
			HttpSession  session =WebContextFactory.get().getSession();
			String pid=(String)session.getAttribute(Constant.CURRENTAPPPID);
			SystemMgmFacade systemMgmFacade  =(SystemMgmFacade)Constant.wact.getBean("systemMgm");
			String rtn=systemMgmFacade.getFlowType(pid, modId);
			//通过返回状态判断
			if("BusinessProcess".equals(rtn)&&conCla.getBillstate()!=0){
				return flag ="系统流程审批后的索赔记录,不能删除!";
			}			
			this.contractDAO.delete(conCla);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				List dataList = new ArrayList();
				dataList.add(conCla);
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,conCla.getPid(),"","","删除合同索赔");
				dataExchangeService.addExchangeListToQueue(ExchangeList);			
			}
		} catch (RuntimeException e) {
			flag = "1";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}

	public Double getClaappmoney(String conid, String parent, String claid)
			throws SQLException, BusinessException {
		String sql="select nvl(claapp.clamoney,0) claappmoney from bdg_cla_app claapp,bdg_money_app bdgmoneyapp where " +
				"claapp.conid=bdgmoneyapp.conid and claapp.pid=bdgmoneyapp.pid and claapp.bdgid=bdgmoneyapp.bdgid and " +
				"claapp.conid='"+conid+"' and claapp.claid='"+claid+"' and bdgmoneyapp.parent='0'";
		System.out.println("sql:**"+sql);
		Double claappmoney=0.0;
		List list =this.contractDAO.getDataAutoCloseSes(sql);
		if(list!=null&&list.size()>0){
			Object o =list.get(0);
			claappmoney=Double.parseDouble(o.toString());
		}
		
		return claappmoney;
	}
}





