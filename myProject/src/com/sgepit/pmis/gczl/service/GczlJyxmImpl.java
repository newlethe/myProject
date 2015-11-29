package com.sgepit.pmis.gczl.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.hbm.FlwDefinition;
import com.sgepit.frame.flow.hbm.GczlFlow;
import com.sgepit.frame.flow.hbm.GczlJymb;
import com.sgepit.frame.flow.hbm.GczlJyxm;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.gczl.dao.GczlDAO;
import com.sgepit.pmis.gczl.hbm.GczlJyxmApproval;
import com.sgepit.pmis.gczl.hbm.GczlJyxmApprovalLog;
import com.sgepit.pmis.wzgl.hbm.WzCkclb;

public class GczlJyxmImpl implements GczlJyxmFacade {
	private GczlDAO gczlDAO;
	
	public GczlDAO getGczlDAO() {
		return gczlDAO;
	}

	public void setGczlDAO(GczlDAO gczlDAO) {
		this.gczlDAO = gczlDAO;
	}
	private String beanNameXm = "com.sgepit.frame.flow.hbm.GczlJyxm";
	private String beanNameWord = "com.sgepit.frame.flow.hbm.GczlJymb";
	private String beanNameFlow = "com.sgepit.frame.flow.hbm.GczlFlow";
	private String beanNameWordApproval = "com.sgepit.pmis.gczl.hbm.GczlJyxmApproval";
	private String beanNameWordApprovalLog= "com.sgepit.pmis.gczl.hbm.GczlJyxmApprovalLog";
	public List<ColumnTreeNode> gczlJyxmTree(String parentId, String pid)
			throws BusinessException {
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId: "root";
		StringBuffer bfs = new StringBuffer();
		bfs.append("parentbh='" + parent + "' and pid = '"+pid+"' ");
		bfs.append(" order by xmbh ");
		List modules = this.gczlDAO.findByWhere(beanNameXm, bfs.toString());
		Iterator<GczlJyxm> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			GczlJyxm temp = (GczlJyxm) itr.next();
			int leaf = Integer.parseInt(temp.getIsleaf());
			n.setId(temp.getUids());			// treenode.id
			n.setText(temp.getXmmc());		// treenode.text
			cn.setColumns(JSONObject.fromObject(temp));
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("icon-pkg");		// treenode.cls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

	
	public boolean isHasChilds(String uids){
		boolean flag = false;
		List list =  this.gczlDAO.findByProperty(beanNameXm, "parentbh", uids);
		if (list.size() > 0){
			flag = true;
		}
		return flag;
	}
	
	/**
	 * 检验项目结构维护 - 新增、修改节点
	 * @return
	 */
	public int addOrUpdate(GczlJyxm gczljyxm){
		int flag = 0;	// 返回标志: 0为成功，1为失败
		System.out.println("gczljyxm-->>"+gczljyxm);
		try {		
			if ("".equals(gczljyxm.getUids()) || gczljyxm.getUids()==null){   //  新增
				List list = (List)this.gczlDAO.findByProperty(beanNameXm, "parentbh", gczljyxm.getParentbh());
				if (list.isEmpty()){
					GczlJyxm jyxm = (GczlJyxm)this.gczlDAO.findByProperty(beanNameXm, "uids",gczljyxm.getParentbh()).get(0);
					jyxm.setIsleaf("0");
					this.gczlDAO.saveOrUpdate(jyxm);
				}
				this.gczlDAO.insert(gczljyxm);
			}else{
				this.gczlDAO.saveOrUpdate(gczljyxm);
			}
		} catch (BusinessException e) {
			flag = 1; 
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 检验结构维护 - 删除节点
	 * @return
	 */
	public int deleteChildNode(String uids){
		int flag = 0;  // 删除返回标志: 0为成功，1为失败，2分类下有模板或流程，不能删除
		GczlJyxm gczljyxm = (GczlJyxm)this.gczlDAO.findByProperty(beanNameXm,"uids", uids).get(0);
		String parentId = gczljyxm.getParentbh();
		List list = (List)this.gczlDAO.findByProperty(beanNameXm, "parentbh", parentId);
		try {
			String jyxmUids = gczljyxm.getUids();
			if(isHasWordOrFlow(jyxmUids)){
				flag = 2;
			}else if (!"0".equals(parentId)){
				this.gczlDAO.delete(gczljyxm);
				if (list.size() == 1){
					GczlJyxm jyxmParent =(GczlJyxm) this.gczlDAO.findByProperty(beanNameXm,"uids", parentId).get(0);
					jyxmParent.setIsleaf("1");
					this.gczlDAO.saveOrUpdate(jyxmParent);
				}
			}else{
				flag = 1;
			}
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}	
	
	/**
	 * 判断当前选中的分类下是否有模板或者流程
	 * @param uids
	 * @return
	 */
	public boolean isHasWordOrFlow(String uids){
		boolean bool = false;
		try {
			GczlJyxm gczljyxm = (GczlJyxm) this.gczlDAO.findById(beanNameXm, uids);
			if(gczljyxm != null){
				String jyxmUids = gczljyxm.getUids();
				List listWord = this.gczlDAO.findByProperty(beanNameWord, "jyxmUids", jyxmUids);
				List listFlow = this.gczlDAO.findByProperty(beanNameFlow, "jyxmUids", jyxmUids);
				if(listWord.size()>0 || listFlow.size()>0){
					bool = true;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			bool = false;
		}
		return bool;
	}
	
	
	/**
	 * 保存模板
	 * @param jymb：模板对象
	 * @return 1:添加成功，2:修改成功
	 */
	public String saveOrUpdateWord(GczlJymb jymb){
		String flag = "1";
		String uids = jymb.getUids();
		String fileid = jymb.getFileid();	
		jymb.setFiledate(new Date());
		if(uids != null && !uids.equals("")){
			this.gczlDAO.saveOrUpdate(jymb);
			flag="2";
		}else{
			this.gczlDAO.insert(jymb);
		}
		return flag;
	}
	
	/**
	 * 删除模板
	 * @param 
	 * @return
	 */
	public int deleteWordById(String uids){
		int flag = 0;  // 删除返回标志: 0为成功，1为失败
		GczlJymb gczljymb = (GczlJymb)this.gczlDAO.findById(this.beanNameWord, uids);
		//String parentId = gczljymb.getParentbh();
		//List list = (List)this.gczlDAO.findByProperty(beanName, "parentbh", parentId);
		try {
			this.gczlDAO.delete(gczljymb);
			//删除对应模板文件APP_BLOB
			String fileid = gczljymb.getFileid();
			this.gczlDAO.deleteFileInBlob(fileid);
		} catch (BusinessException e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 删除模板时判断该模板是否有在流程中使用过
	 * @param fileid 模板文件ID
	 * @return Boolean true:没有流程使用过这个模板，可以删除 false:有流程使用，不能删除
	 */
	public boolean getFlowByFileId(String fileid){
		Boolean bool = true;
		String beanFlw = "com.sgepit.frame.flow.hbm.FlwInstance";
		List<Object> list = this.gczlDAO.findByProperty(beanFlw, "fileid", fileid);
		if(list.size()>0){
			bool = false;
		}
		return bool;
	}
	/**
	 * 禁用模板
	 * @param uids 检验项目分类模板id
	 */
	public void setWordDisableById(String uids){
		GczlJymb jymb = (GczlJymb) this.gczlDAO.findById(this.beanNameWord, uids);
		jymb.setIsstart(0L);
		jymb.setIsdefault(0L);
		this.gczlDAO.saveOrUpdate(jymb);
	}
	
	
	/**
	 * 设置默认 其他所有变为非默认
	 * @param uids 当前模板信息主键
	 * @param nodeUids 当前项目分类节点主键
	 * @param tabs：word设置默认的模板[flow设置默认的流程]
	 */
	public void setDefaultById(String uids,String nodeUids,String tabs){
		if(tabs.equals("word")){
			this.gczlDAO.updateBySQL("update GCZL_JYMB set ISDEFAULT=0 where JYXM_UIDS = '"+nodeUids+"'");
			this.gczlDAO.updateBySQL("update GCZL_JYMB set ISDEFAULT=1 where UIDS = '"+uids+"'");
		}else if(tabs.equals("flow")){
			this.gczlDAO.updateBySQL("update GCZL_FLOW set ISDEFAULT=0 where JYXM_UIDS = '"+nodeUids+"'");
			this.gczlDAO.updateBySQL("update GCZL_FLOW set ISDEFAULT=1 where UIDS = '"+uids+"'");
		}
	}
	
	/**
	 * 设置模板禁用或启用
	 * @param uids
	 */
	public void setDisableWordById(String uids){
		GczlJymb jymb = (GczlJymb) this.gczlDAO.findById(beanNameWord, uids);
		jymb.setIsstart(jymb.getIsstart()==1L?0L:1L);
		jymb.setIsdefault(0L);
		this.gczlDAO.saveOrUpdate(jymb);
	}
	
	
	/**
	 * 保存流程
	 * @param uids：流程主键
	 * @param userid：当前登陆用户主键
	 * @param jyxmUids：检验项目分类主键
	 */
	public void saveFlow(String[] uids,String userid,String jyxmUids){
		//String[] flowUids = uids.split(",");
		for (int i = 0; i < uids.length; i++) {
			String where = " jyxmUids='"+jyxmUids+"' and flowid='"+uids[i]+"'";
			List<GczlFlow> list = this.gczlDAO.findByWhere(this.beanNameFlow, where);
			GczlJyxm gczlJyxm = (GczlJyxm) this.gczlDAO.findById(beanNameXm, jyxmUids);
			if(list.size()==0){
				GczlFlow gczlFlow = new GczlFlow();
				gczlFlow.setFlowdate(new Date());
				gczlFlow.setFlowid(uids[i]);
				gczlFlow.setFlowuser(userid);
				gczlFlow.setIsdefault(0L);
				gczlFlow.setJyxmUids(jyxmUids);
				gczlFlow.setXmbh(gczlJyxm.getXmbh());
				gczlFlow.setPid(this.getPid());
				this.gczlDAO.saveOrUpdate(gczlFlow);
			}
		}
	}
	
	
	/**
	 * 删除流程
	 * @param uids
	 */
	public int deleteFlowById(String uids){
		int flag = 0;  // 删除返回标志: 0为成功，1为失败
		GczlFlow gczlflow = (GczlFlow)this.gczlDAO.findById(this.beanNameFlow, uids);
		try {
			this.gczlDAO.delete(gczlflow);
		} catch (BusinessException e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 从session获取pid
	 * @return
	 */
	public String getPid() {
		String pid = "";
		WebContext webContext = WebContextFactory.get();    
		if(webContext!=null){
			HttpSession session = webContext.getSession() ;
			//通过session获取pid，可以不从前台传递
			pid = session.getAttribute(Constant.CURRENTAPPPID).toString(); 
		}
		return pid;
	}
	
	
	/**
	 * 判断当前项目是否有质量验评树的更节点，没有则自动添加
	 * 多项目系统中，跟节点的parentbh为0，其他节点的parentbh存放的是父节点的uids
	 * @param pid
	 * @param root
	 * @return 返回根节点uids
	 * @author: zhangh
	 * @createDate: 2011-6-1
	 */
	public String isHaveTreeRoot(String pid, String root){
		String where = " pid='"+pid+"' and xmmc='"+root+"' ";
		List<GczlJyxm> list = this.gczlDAO.findByWhere(this.beanNameXm, where);
		GczlJyxm jyxm = new GczlJyxm();
		if(list.size()==0){
			jyxm.setPid(pid);
			jyxm.setXmbh("1");
			jyxm.setXmmc(root);
			jyxm.setIsleaf("1");
			jyxm.setParentbh("0");
			this.gczlDAO.insert(jyxm);
		}else{
			jyxm = list.get(0);
		}
		return jyxm.getUids();
	}
	/*
	 * 检验模块记录保存
	 * @param GczlJyxmApproval
	 * author:shangtw
	 * */
	public String saveOrUpdateApproval(GczlJyxmApproval gczlJyxmApproval) {
		GczlJymb jymb=new GczlJymb();
		jymb.setMbname(gczlJyxmApproval.getMbname());
		jymb.setUids(gczlJyxmApproval.getJymbUids());
		jymb.setFileid(gczlJyxmApproval.getFileid());
		jymb.setFilesize(gczlJyxmApproval.getFilesize());
		jymb.setFileuser(gczlJyxmApproval.getFileuser());
		jymb.setJyxmBh(gczlJyxmApproval.getJyxmBh());
		jymb.setJyxmUids(gczlJyxmApproval.getJyxmUids());
		jymb.setPid(gczlJyxmApproval.getPid());
		jymb.setRemark(gczlJyxmApproval.getRemark());
		String flag = "1";
		String uids = jymb.getUids();
		jymb.setFiledate(new Date());
		if(uids != null && !uids.equals("")){
			this.gczlDAO.saveOrUpdate(jymb);
			this.gczlDAO.saveOrUpdate(gczlJyxmApproval);
			flag="2";
		}else{
			String jymbUids=this.gczlDAO.insert(jymb);
			gczlJyxmApproval.setJymbUids(jymbUids);
			this.gczlDAO.insert(gczlJyxmApproval);
		}
		return flag;
	}
	/**
	 * 删除审批信息
	 * @param uids
	 * @author shangtw
	 */	
	public int deleteWordApprovalById(String uids){
		int flag = 0;  // 删除返回标志: 0为成功，1为失败
		GczlJyxmApproval gczlJyxmApproval = (GczlJyxmApproval)this.gczlDAO.findById(this.beanNameWordApproval, uids);
		try {
			this.gczlDAO.delete(gczlJyxmApproval);
		} catch (BusinessException e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}
	/**
	 * 得到审批组合信息
	 * @param approvaluids
	 * @param mbuids
	 * @author shangtw
	 */	
	public GczlJyxmApproval findByDoubleId(String approvaluids, String mbuids) {
		GczlJyxmApproval gczlJyxmApproval = (GczlJyxmApproval)this.gczlDAO.findById(this.beanNameWordApproval, approvaluids);
		GczlJymb gczljymb = (GczlJymb)this.gczlDAO.findById(this.beanNameWord, mbuids);
		gczlJyxmApproval.setMbname(gczljymb.getMbname());
		gczlJyxmApproval.setJymbUids(gczljymb.getUids());
		gczlJyxmApproval.setFiledate(gczljymb.getFiledate());
		gczlJyxmApproval.setFileid(gczljymb.getFileid());
		gczlJyxmApproval.setFilesize(gczljymb.getFilesize());
		gczlJyxmApproval.setFileuser(gczljymb.getFileuser());
		gczlJyxmApproval.setJyxmBh(gczljymb.getJyxmBh());
		gczlJyxmApproval.setJyxmUids(gczljymb.getJyxmUids());
		return gczlJyxmApproval;
	}
	/**
	 * 上报审批信息
	 * @param approvaluids
	 * @param userid
	 * @author shangtw
	 */	
	public String uploadApproval(String approvalUids, String userid,String newStatus,String approvalResult) {
		GczlJyxmApproval gczlJyxmApproval = (GczlJyxmApproval)this.gczlDAO.findById(this.beanNameWordApproval, approvalUids);
	    String oldStatus=gczlJyxmApproval.getApprovalStatus();
	    gczlJyxmApproval.setApprovalStatus(newStatus);
	    gczlJyxmApproval.setApprovalResult(approvalResult);
	    String flag="1";
	    GczlJyxmApprovalLog gczlJyxmApprovalLog=new GczlJyxmApprovalLog();
	    gczlJyxmApprovalLog.setPid(gczlJyxmApproval.getPid());
	    gczlJyxmApprovalLog.setAppprovalUids(approvalUids);
	    gczlJyxmApprovalLog.setBeforeStatus(oldStatus);
	    gczlJyxmApprovalLog.setStatus(newStatus);
	    gczlJyxmApprovalLog.setOperator(userid);
	    gczlJyxmApprovalLog.setOperateTime(new Date());
	   
	    try {
			gczlDAO.saveOrUpdate(gczlJyxmApproval);
			gczlDAO.insert(gczlJyxmApprovalLog);
		} catch (RuntimeException e) {
			flag="0";
			e.printStackTrace();
		}
	    
		return flag;
	}	
}
