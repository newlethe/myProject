package com.sgepit.pmis.wzgl.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.wzgl.dao.WZglDAO;

public class WZGLMgmImpl implements WZGLMgmFacade {
	private BaseDAO baseDao;
	private WZglDAO wzglDAO;
	
	public static WZGLMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (WZGLMgmImpl) ctx.getBean("wzglMgmImpl");
	}
	
	//构造物资管理部分各columnTree
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		WzBaseInfoMgmFacade wzBaseInfoMgmImpl= (WzBaseInfoMgmFacade)Constant.wact.getBean("wzBaseInfoMgmImpl");
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if (treeName.equalsIgnoreCase("wzBmTypeTree")) {//物资编码管理树
			Iterator it = params.entrySet().iterator();
			String pid = "";
			while(it.hasNext()){
				Map.Entry<String, String[]> entry = (Entry<String, String[]>) it.next();
				String field = entry.getKey().toString();
				String value = entry.getValue()[0];
				if("pid".equals(field)){
					pid = value;
				}
			}
			list = wzBaseInfoMgmImpl.getWzBmTree(parentId,pid);
			return list;
		}
		if (treeName.equalsIgnoreCase("wzBmTypeTreeCheck")) {//物资编码管理树
			Iterator it = params.entrySet().iterator();
			String userid ="";
			String userrole = "";
			String pid = "";
			while(it.hasNext()){
				Map.Entry<String, String[]> entry = (Entry<String, String[]>) it.next();
				String field = entry.getKey().toString();
				String value = entry.getValue()[0];
				if("userid".equals(field)){
					userid = value;
				}else if("userrole".equals(field)){
					userrole = value;
				}else if("pid".equals(field)){
					pid = value;
				}
			}
			
			list = wzBaseInfoMgmImpl.getWzBmTreeCheck(parentId,userid,userrole,pid);
			return list;
		}
		if(treeName.equalsIgnoreCase("csBmTypeTree")){
			Iterator it = params.entrySet().iterator();
			String pid = "";
			while(it.hasNext()){
				Map.Entry<String, String[]> entry = (Entry<String, String[]>) it.next();
				String field = entry.getKey().toString();
				String value = entry.getValue()[0];
				if("pid".equals(field)){
					pid = value;
				}
			}
			list = wzBaseInfoMgmImpl.getcsBmTree(parentId,pid);
			return list;
		}if(treeName.equalsIgnoreCase("WzTypeTreeList")){
			String whereStr = "";
			String conid="";
			if (params!=null && params.size()>0) {
				String[] pid = (String[]) params.get("pid");
				conid=((String[])params.get("conid"))[0];
				if (pid!=null && pid.length>0) {
					whereStr += " and pid='" + pid[0] + "'";
				}
			}
		   list = wzBaseInfoMgmImpl.WzTypeTreeList(parentId, whereStr, conid);
		   return list;
		}
		if(treeName.equalsIgnoreCase("WzBodyTreeList")){
			String whereStr = "";
			if (params!=null && params.size()>0) {
			}
		   list = wzBaseInfoMgmImpl.WzBodyTreeList(parentId, whereStr);
		   return list;
		}
		return null;
	}	
	
	public WZglDAO getWzglDAO() {
		return wzglDAO;
	}


	public void setWzglDAO(WZglDAO wzglDAO) {
		this.wzglDAO = wzglDAO;
	}


	public BaseDAO getBaseDao() {
		return baseDao;
	}


	public void setBaseDao(BaseDAO baseDao) {
		this.baseDao = baseDao;
	}


}
