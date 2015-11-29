package com.sgepit.pmis.safeManage.service;

import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.safeManage.hbm.SafeAccidentReport;
import com.sgepit.pmis.safeManage.hbm.SafeCasualtyAccident;
import com.sgepit.pmis.safeManage.hbm.SafeEducationCard;
import com.sgepit.pmis.safeManage.hbm.SafeEnterpriseAccident;
import com.sgepit.pmis.safeManage.hbm.SafeEnterpriseDetail;
import com.sgepit.pmis.safeManage.hbm.SafeExamineType;
import com.sgepit.pmis.safeManage.hbm.SafeUser;
import com.sgepit.pmis.safeManage.hbm.SafetyCheckItem;
import com.sgepit.pmis.safeManage.hbm.SafetyMoneyApplyPg;
import com.sgepit.pmis.safeManage.hbm.SevereAccidentRegister;

public interface SafeManageMgmFacade {
	
	
	
	public void insertSafeUser(SafeUser safeUser);
	
	public void updateSafeUser(SafeUser safeUser);
	
	public void insertSevereAccidentRegister(SevereAccidentRegister severeAccidentRegister);
	
	public void updateSevereAccidentRegister(SevereAccidentRegister severeAccidentRegister);
	
	public void insertSafeAccident(SafeAccidentReport safeAccident);
	
	public void updateSafeAccident(SafeAccidentReport safeAccident); 
	
	public void insertCasualtyAccident(SafeCasualtyAccident safeAccident);
	
	public void updateCasualtyAccident(SafeCasualtyAccident safeAccident); 
	
	public void insertSafeEnterpriseAccident(SafeEnterpriseAccident safeAccident);
	
	public void updateSafeEnterpriseAccident(SafeEnterpriseAccident safeAccident); 
	
	public void insertSafeEnterpriseDetail(SafeEnterpriseDetail safeAccident);
	
	public void updateSafeEnterpriseDetail(SafeEnterpriseDetail safeAccident);
	
	public void insertSafeEducationCard(SafeEducationCard safeCard);
	
	public void updateSafeEducationCard(SafeEducationCard safeCard);
	
	public void insertSafeExamineType(SafeExamineType safeType);
	
	public void updateSafeExamineType(SafeExamineType safeType);
	
	public List<ColumnTreeNode> ShowUserTypeTree(String parentId) throws BusinessException;
	
	public List<ColumnTreeNode> ShowSafeTypeTree(String parentId) throws BusinessException;
	
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException;
	
	public int deleteChildNode(String noid);
	
	public int addOrUpdate(SafeExamineType tree); 
	
	public String getMaxBm(String treeid,String bm);
	
	//新增检查项目
	public String insertSafetyCheckItem(SafetyCheckItem safetyCheckItem);
	//修改检测项目
	public void updateSafetyCheckItem(SafetyCheckItem safetyCheckItem);
	//删除检查项目
	public void deleteSafetyCheckItem(String beanName,String beanCont,String uuid);
	
	
	//新增安全专款评估
	public String insertSafetyMoneyApplyPg(SafetyMoneyApplyPg safetyMoneyApplyPg);
	//修改安全专款评估
	public void updateSafetyMoneyApplyPg(SafetyMoneyApplyPg safetyMoneyApplyPg);
	//删除安全专款评估
	public void deleteSafetyMoneyApplyPg(String beanName,String uuid);
	
	public Object findBeanByProperty(String beanName,String propertyName,String value);
}
