package com.sgepit.pmis.coninvested.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.pmis.budget.dao.BdgInfoDAO;
import com.sgepit.pmis.budget.dao.ConInvestedDAO;
import com.sgepit.pmis.budget.hbm.BdgCorpInfo;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.coninvested.hbm.CorpCompletionSub;

public class CorpInvestedMgmImpl extends BaseMgmImpl  implements CorpInvestedMgmFacade{

	private ConInvestedDAO conInvestedDAO;
	private BdgInfoDAO  bdginfodao;
	private String BeanName = BusinessConstants.ConInv_PACKAGE + BusinessConstants.corp_invested;
	private String subBeanName = BusinessConstants.ConInv_PACKAGE + BusinessConstants.Sub_CorpInvested;
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static CorpInvestedMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (CorpInvestedMgmImpl) ctx.getBean("corpInvMgm");
	}
	
	public String checkDelete(String[] corpinvesteid) throws SQLException,
			BusinessException {
		String state = "";
		for (int i = 0; i < corpinvesteid.length; i++){
			List list = this.conInvestedDAO.findByProperty(subBeanName, "corpinvesteid", corpinvesteid[i]);
			if (!list.isEmpty()){
				state = "有明细信息，不能被删除！";
				break;
			}
		}
		return state;
	
	}
	
	
	 /*
	 * author:李晓斌
	 * 生成建设法人树
	 */
	public String CreatedBdgCorpTree(String parentId,String corpbasicid)
			throws BusinessException {
		StringBuffer sbf = new StringBuffer("[");
		try {
			String parent = parentId != null ? parentId
					: BusinessConstants.APPBudgetRootID;

			String str = "parent = '" + parent + "'";

			List list = this.bdginfodao.findByWhere(
					BusinessConstants.BDG_PACKAGE
							.concat(BusinessConstants.BDG_CORP_INFO), str);

			BdgCorpInfo bma = null;

			List bmaExtlist = new ArrayList();

			for (int i = 0; i < list.size(); i++) {
				bma = new BdgCorpInfo();

				bma = (BdgCorpInfo) list.get(i);

				BdgInfo bi = (BdgInfo) this.bdginfodao.findById(
						BusinessConstants.BDG_PACKAGE
								.concat(BusinessConstants.BDG_INFO), bma.getBdgid());
				bma.setBdgmoney(bi.getBdgmoney());
				bma.setBdgno(bi.getBdgno());
				bma.setBdgname(bi.getBdgname());
				bmaExtlist.add(bma);
				
			}
			
			Iterator itr = bmaExtlist.iterator();
			while (itr.hasNext()) {
				BdgCorpInfo temp = (BdgCorpInfo) itr.next();
				
				int leaf = temp.getIsleaf().intValue();
        
				sbf.append("{bdgid:\"");
				sbf.append(temp.getBdgid());
				sbf.append("\",basicid:\"");
				sbf.append(temp.getBasicid());
				sbf.append("\",pid:\"");
				sbf.append(temp.getPid());
				sbf.append("\",corpid:\"");
				sbf.append(temp.getCorpid());
				sbf.append("\",bdgno:\"");
				sbf.append(temp.getBdgno());
				sbf.append("\",appmoney:");
				Double appmoney = temp.getAppmoney();
				if (appmoney == null){
					appmoney = new Double(0); 
				}
				sbf.append(appmoney);
				sbf.append(",bdgmoney:");
				Double bdgmoney = temp.getBdgmoney();
				if (bdgmoney == null){
					bdgmoney = new Double(0); 
				}
				sbf.append(bdgmoney);
				sbf.append(",bdgname:\"");
				sbf.append(temp.getBdgname());
				sbf.append("\",corpremark:\"");
				sbf.append(temp.getCorpremark());
				sbf.append("\",isleaf:");
				sbf.append(temp.getIsleaf());
				sbf.append(",parent:\"");
				sbf.append(temp.getParent());
				sbf.append("\",uiProvider:\"col\"");
				if (0 == leaf) {
					sbf.append(",cls:\"master-task\",iconCls:\"task-folder\"");
					sbf.append(",children:");
					
					//System.out.println("------------------------:"+temp.getBdgid());
					
					sbf.append(CreatedBdgCorpTree(temp.getBdgid(),corpbasicid));
				} else {
					sbf.append(",iconCls:\"task\",leaf:true");
				}
				sbf.append("}");
				if (itr.hasNext()) {
					sbf.append(",");
				}
			}
			sbf.append("]");
		} catch (Exception e) {
			e.printStackTrace();
			throw new BusinessException(e.getMessage());
		}
		
		return sbf.toString();
	}
  
	/*
	 * 
	 * 初始华概算树数据,并将选中数据保存到表中
	 */
	public void CreatedBdgCorpTree(String corpbasicid,String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			CorpCompletionSub bme = new CorpCompletionSub();
			BdgInfo dgInfo = (BdgInfo) this.bdginfodao.findById(
					subBeanName, ids[i]);
			bme.setBdgmoney(dgInfo.getBdgmoney());
			bme.setBdgname(dgInfo.getBdgname());
			bdginfodao.insert(bme);
		}
	}

	/**
	 * @return the conInvestedDAO
	 */
	public ConInvestedDAO getConInvestedDAO() {
		return conInvestedDAO;
	}

	/**
	 * @param conInvestedDAO the conInvestedDAO to set
	 */
	public void setConInvestedDAO(ConInvestedDAO conInvestedDAO) {
		this.conInvestedDAO = conInvestedDAO;
	}
	

}
