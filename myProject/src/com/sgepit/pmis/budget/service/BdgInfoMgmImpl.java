package com.sgepit.pmis.budget.service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import net.sf.json.JSONObject;
import oracle.sql.BLOB;

import org.directwebremoting.WebContextFactory;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.dao.BdgInfoDAO;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.VBdgInfo;
import com.sgepit.pmis.common.BusinessConstants;

public class BdgInfoMgmImpl extends BaseMgmImpl implements BdgInfoMgmFacade {

	private BdgInfoDAO bdgInfoDao;
	
	public static BdgInfoMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (BdgInfoMgmImpl) ctx.getBean("bdgInfoMgm");
	}
	
	public void setBdgInfoDao(BdgInfoDAO bdgInfoDao) {
		this.bdgInfoDao = bdgInfoDao;
	}

	public void deleteBdgInfo(BdgInfo bdgInfo) throws SQLException,BusinessException {
		this.bdgInfoDao.delete(bdgInfo);
	}

	public void insertBdgInfo(BdgInfo bdgInfo) throws SQLException,BusinessException {
		//修改了bdg_info表主键规则为assigned，不再使用uuid,集团项目要带上pid pengy 2014-03-27
		bdgInfo.setBdgid(bdgInfo.getPid() + "-" + bdgInfo.getBdgno());
		this.bdgInfoDao.insert(bdgInfo);
	}

	public void updateBdgInfo(BdgInfo bdgInfo) throws SQLException,BusinessException {
		this.bdgInfoDao.saveOrUpdate(bdgInfo);
	}
	
	/*
	 *  获得概算结构 - 树
	 */
	public List<ColumnTreeNode> BdgInfoTree(String parentId, String pid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and pid = '%s' order by bdgid";
		str = String.format(str, parentId, pid);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE")))
		initBdgTree(parentId,pid);
		String sql="select *from v_bdg_info where "+str;
		Session ses = HibernateSessionFactory.getSession();
		SQLQuery q = ses.createSQLQuery(sql).addEntity(VBdgInfo.class);
		List<VBdgInfo> objects = q.list();
		ses.close();
		Iterator<VBdgInfo> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			VBdgInfo temp = (VBdgInfo) itr.next();
			temp.setRemainder((temp.getBdgmoney()==null?0:temp.getBdgmoney()) - (temp.getConbdgappmoney() == null?0: temp.getConbdgappmoney()));
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getBdgid());			// treenode.id
			n.setText(temp.getBdgname());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("task");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("task-folder");	// treenode.iconCls
			}
			n.setIfcheck("none");
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	/*
	 *  获得概算查询结构 - 树
	 */
	public List<ColumnTreeNode> BdgInfoTreeQuery(String parentId, String pid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and pid = '%s' order by bdgid";
		str = String.format(str, parentId, pid);
		List<BdgInfo> objects = this.bdgInfoDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), str);
		Iterator<BdgInfo> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgInfo temp = (BdgInfo) itr.next();
			
			String sql = "select sum(factpay) as sumfactpay from bdg_pay_app where bdgid='" + temp.getBdgid() + "'";
			List  list_= this.bdgInfoDao.getDataAutoCloseSes(sql);
			Double dd = null;
			if(list_.iterator().hasNext()){
				if(list_.get(0)!=null){
					dd = ((BigDecimal)list_.get(0)).doubleValue();
				}
			}
			temp.setSumfactpay(dd==null?0:dd);
			temp.setDifference(temp.getContmoney()-(dd==null?0:dd));
			temp.setRemainder((temp.getBdgmoney()==null?0:temp.getBdgmoney()) - (temp.getContmoney() == null?0: temp.getContmoney()));
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getBdgid());			// treenode.id
			n.setText(temp.getBdgname());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("task");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("task-folder");	// treenode.iconCls
			}
			n.setIfcheck("none");
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	
	/**
	 * 获得概算结构 - 树,平衡检查树。列出所有不平衡的树
	 * @param parentId
	 * @param pid
	 * @deprecated	使用新的方法 ：bdgCheckTreeGrid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> BdgCheckTree(String parentId, String pid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and pid = '%s' and bdgmoney <> bdgmoneyCal order by bdgid";
		str = String.format(str, parentId, pid);
		List<BdgInfo> objects = this.bdgInfoDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), str);
		Iterator<BdgInfo> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgInfo temp = (BdgInfo) itr.next();
			temp.setRemainder((temp.getBdgmoney()==null?0:temp.getBdgmoney()) - (temp.getContmoney() == null?0: temp.getContmoney()));
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getBdgid());			// treenode.id
			n.setText(temp.getBdgname());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("task");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("task-folder");	// treenode.iconCls
			}
			n.setIfcheck("none");
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	
	/**
	 * 检查概算项目  录入概算金额≠汇总计算概算金额
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map	参数
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-5-29
	 */
	public List<ColumnTreeNode> bdgCheckTreeGrid(String orderBy, Integer start, Integer limit, HashMap map) {
		
		List<VBdgInfo> list = new ArrayList();
	       //页面定义处的参数
		String  parent=(String)map.get("parent");
	       //页面定义处的参数
		String pid=(String)map.get("pid");
		String str = "parent = '%s' and pid = '%s' order by bdgno";
		str = String.format(str, parent, pid);
	       //拼装一般查询语句
		list =bdgInfoDao.findByWhere(BdgInfo.class.getName(), str);
		    //对查询语句的返回值进行处理，
			//其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
			//isleaf是根据当前实体Bean 中的属性进行定义
			//如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
			//如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置
			//则页面显示复选框及是否选中状态
		List newList=DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
	
	/**
	 * 概算结构维护 - 新增、修改节点
	 * @author xiaos
	 * @param bdgInfo
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public int addOrUpdate(BdgInfo bdgInfo){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO;
		
		String where =" pid='"+bdgInfo.getPid()+"' and bdgno='"+bdgInfo.getBdgno()+"' ";
		if(!"".equals(bdgInfo.getBdgid())){
			where+=" and bdgid !='"+bdgInfo.getBdgid()+"'";
		}
		List listBdgno=bdgInfoDao.findByWhere(beanName, where);
		if(listBdgno.isEmpty()){
		try {
			bdgInfo.setBdgmoneyCal(bdgInfo.getBdgmoney());
			bdgInfo.setRemainingMoneyCal(bdgInfo.getRemainingMoney());
			 if ("".equals(bdgInfo.getBdgid())){   //  新增
				List list = (List)this.bdgInfoDao.findByProperty(beanName, "parent", bdgInfo.getParent());
				if (list.isEmpty()){
					BdgInfo parentBdg = (BdgInfo)this.bdgInfoDao.findById(beanName, bdgInfo.getParent());
					parentBdg.setIsleaf(new Long(0));
					parentBdg.setBdgflag(new Long(1));
					this.updateBdgInfo(parentBdg);
				}
				this.insertBdgInfo(bdgInfo);
			}else{
				  this.updateBdgInfo(bdgInfo);
			}
			this.sumMoneyHandler(bdgInfo.getParent());
			List l= bdgInfoDao.getDataAutoCloseSes("select * from  bdg_info  " +
				 		" start with  bdgid='"+bdgInfo.getBdgid()+"' and pid='"+bdgInfo.getPid()+"' " +
				 		" connect by prior parent =bdgid  and pid='"+bdgInfo.getPid()+"'");
			//需要进行数据交互， 动态数据和概算变更的条目添加到交互队列
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){  
				 List dataList = new ArrayList();
				 for(int i=0;i<l.size();i++){
					 Object [] objs = (Object [])l.get(i);
					 BdgInfo  bdg = new BdgInfo();
					 bdg.setBdgid((String)objs[0]);
					 dataList.add(bdg);
					 PcDynamicData  pdd = new PcDynamicData();
					 pdd.setPcdynamicdate(new Date());
					 pdd.setPctablebean(BdgInfo.class.getName());
					 pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgInfo.class.getName()));
					 pdd.setPcurl(DynamicDataUtil.BDG_INFO_URL);
					 pdd.setPid(bdgInfo.getPid());
					 pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					 pdd.setPctableuids((String)objs[0]);
					 bdgInfoDao.insert(pdd);
					 dataList.add(pdd);
				 }
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgInfo.getPid(),"","","新增或修改结算树");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
			else 
			{
				 for(int i=0;i<l.size();i++){
					 Object [] objs = (Object [])l.get(i);
					 BdgInfo  bdg = new BdgInfo();
					 bdg.setBdgid((String)objs[0]);
					 PcDynamicData  pdd = new PcDynamicData();
					 pdd.setPcdynamicdate(new Date());
					 pdd.setPctablebean(BdgInfo.class.getName());
					 pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgInfo.class.getName()));
					 pdd.setPcurl(DynamicDataUtil.BDG_INFO_URL);
					 pdd.setPid(bdgInfo.getPid());
					 pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					 pdd.setPctableuids((String)objs[0]);
					 bdgInfoDao.insert(pdd);
				 }
			}
		} catch (SQLException e) {
			flag = 1; 
			e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; 
			e.printStackTrace();
		}
		}else {
			flag=2;
		}
		return flag;
	}
	
	/**
	 * 概算结构维护 - 删除节点
	 * @author xiaos
	 * @param bdgId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public int deleteChildNode(String bdgId){
		int flag = 0;  // 删除返回标志: 0为成功，1为失败
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO;
		BdgInfo bdgInfo = (BdgInfo)this.bdgInfoDao.findById(beanName, bdgId);
		String parentId = bdgInfo.getParent();
		List list = (List)this.bdgInfoDao.findByProperty(beanName, "parent", parentId);
		
		try {
			if (!"0".equals(parentId)){
				this.bdgInfoDao.delete(bdgInfo);
				this.sumMoneyHandler(bdgInfo.getParent());
				if (list.size() == 1){
					BdgInfo bdgInfoParent =(BdgInfo) this.bdgInfoDao.findById(beanName,  parentId);
					bdgInfoParent.setIsleaf(new Long(1));
					this.bdgInfoDao.saveOrUpdate(bdgInfoParent);
				}
				if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
					HttpSession  httpSession =WebContextFactory.get().getSession();
					String pid=(String)httpSession.getAttribute(Constant.CURRENTAPPPID);
					List delBdgInfo=bdgInfoDao.getDataAutoCloseSes(" select * from  bdg_info     start with  bdgid='"+parentId+"' and pid='"+pid+"' connect by prior  parent =bdgid and pid='"+pid+"'");
					List dataList = new ArrayList();
					dataList.add(bdgInfo);
					for(int i=0;i<delBdgInfo.size();i++){
						Object [] objs = (Object [])delBdgInfo.get(i);
						BdgInfo  bdg = new BdgInfo();
						bdg.setBdgid((String)objs[0]);
						dataList.add(bdg);
					}
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","删除概算结构树节点");
					dataExchangeService.addExchangeListToQueue(ExchangeList);	
				}
			}else{
				flag = 1;
			}
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 概算结构维护 - 累计（修改时）
	 * 新增批准概算金额，也需要计算
	 * Modified by Liuay  2012-05-24  汇总计算父节点的 概算金额及预计未签订金额的值
	 * @author xiaos
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	private void sumMoneyHandler(String parentId) throws SQLException, BusinessException{
		Double bdgMoneyCal = new Double(0);
		Double remainingMoneyCal = new Double(0);
		Double ratifyBdgCal = new Double(0);
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO;
		List list = (List)this.bdgInfoDao.findByProperty(beanName, "parent", parentId);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgInfo obj_bdgInfo = (BdgInfo) iterator.next();
			
			bdgMoneyCal += obj_bdgInfo.getBdgmoneyCal()==null ? new Double(0) : obj_bdgInfo.getBdgmoneyCal();
			remainingMoneyCal += obj_bdgInfo.getRemainingMoneyCal()==null ? new Double(0) : obj_bdgInfo.getRemainingMoneyCal();
			//批准概算金额
			ratifyBdgCal += obj_bdgInfo.getRatifyBdgCal()==null ? new Double(0) : obj_bdgInfo.getRatifyBdgCal();
		}
		BdgInfo parentInfo = (BdgInfo)this.bdgInfoDao.findById(beanName, parentId);
		if(parentInfo != null){
			parentInfo.setBdgmoneyCal(bdgMoneyCal);
			parentInfo.setRemainingMoneyCal(remainingMoneyCal);
			parentInfo.setRatifyBdgCal(ratifyBdgCal);
			this.updateBdgInfo(parentInfo);
			
			if (!"0".equals(parentInfo.getParent())) {
				sumMoneyHandler(parentInfo.getParent());
			}
		}
	}
	
	/**
	 * 平衡检查：计算概算金额及预计未签订金额 父节点的计算值，写入数据库库相应字段
	 * 新增批准概算金额，也需要计算
	 * @param pid	项目ID
	 * @param flag	分三种情况：0 进入页面时都计算， 1 只计算概算金额及预计未签订金额， 2 只计算批准概算金额
	 * @throws SQLException
	 * @throws BusinessException
	 * @author: Liuay
	 * @createDate: 2012-5-31
	 */
	public void sumMoneyOfBdgInfo(String pid, String flag) throws SQLException, BusinessException{
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO;
		
		List<String> parentIdList = new ArrayList<String>();
		
//		叶子节点的概算计算金额 = 叶子节点的概算金额,预计未签订金额同
		List leafList = (List)this.bdgInfoDao.findByWhere(beanName, "pid='" + pid + "' and isleaf=1");
		for (Iterator iterator = leafList.iterator(); iterator.hasNext();) {
			BdgInfo leaf_bdgInfo = (BdgInfo) iterator.next();
			if(!flag.equals("2")){
				leaf_bdgInfo.setBdgmoneyCal(leaf_bdgInfo.getBdgmoney());
				leaf_bdgInfo.setRemainingMoneyCal(leaf_bdgInfo.getRemainingMoney());
			}
			if(!flag.equals("1")){
				leaf_bdgInfo.setRatifyBdgCal(leaf_bdgInfo.getRatifyBdg());
			}
			this.updateBdgInfo(leaf_bdgInfo);
			
			String parentId = leaf_bdgInfo.getParent();
			if (!parentIdList.contains(parentId)) {
				parentIdList.add(parentId);
			}
		}

//		汇总计算父节点的概算金额及预计未签订金额
		for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
			this.sumMoneyHandler(iterator.next());
		}
	}

	/**
	 * 查询该概算编号对应的所有的合同
	 * @param bdgid
	 * @return
	 */
	public List queryBdgid(String bdgid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String sql = "select t.*,b.bdgno,b.bdgname,c.conno,c.conname,c.convaluemoney" + 
					 ",t.conbidbdgmoney " +
					 " from v_bdg_con_app t,bdg_info b,v_con c where t.bdgid='" +
					 bdgid + "' and t.bdgid=b.bdgid and t.conid=c.conid ";

	    List list = jdbc.queryForList(sql);	
	    return list;
	} 
	
	
	
	/**
	 * 求该概算编号对应所有合同分摊金额的总和 在bdgMoneyMgm中调用
	 * @param bdgid
	 */
	public void sumContmoney(String bdgid){
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants. BDG_MONEY_APP;
		List<BdgMoneyApp> list = this.bdgInfoDao.findByWhere(beanName, "bdgid = '"+bdgid+"'");
		Double ftjeSum = new Double(0);
		for(int i = 0;i<list.size();i++){
			ftjeSum += list.get(i).getRealmoney()==null?0:list.get(i).getRealmoney();
		}		
		String gsBeanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO;
		BdgInfo bdgInfo = (BdgInfo) this.bdgInfoDao.findById(gsBeanName, bdgid);
		if(bdgInfo != null){
			bdgInfo.setContmoney(ftjeSum);
			this.bdgInfoDao.saveOrUpdate(bdgInfo);
		}
		
		/*
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String sql = " update bdg_info t set t.contmoney= ( " +
			         " select sum(b.realmoney) from bdg_money_app  b where b.bdgid='"+bdgid+"' ) where t.bdgid='"+bdgid+ "'" ;	
		jdbc.update(sql);*/
	}
	
	/**
	 * 求所有分摊合同总金额
	 */
	public Double sumAllRealmoney(String pid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String sql = "select nvl(sum(t.realmoney),0) total  " + 
					 "from bdg_money_app t "  + 
					 " where t.parent='0' and t.pid='" + pid + "'";
	    List list = jdbc.queryForList(sql);	
	    Double totalmoney = new Double(0);
	    Iterator it = list.iterator();
	    if (it.hasNext()){
	    	Map map = (Map)it.next();
	    	totalmoney = new Double(map.get("total").toString());
	    }
	    System.out.println("totalmoney="+totalmoney);
		return totalmoney;
	}
	/**
	 * 判断要被删除的概算节点是否有分摊记录 
	 * @param bdgid
	 * @return
	 */
	public boolean isApportion(String bdgid){
		boolean flag = false;
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP);
		List list =  this.bdgInfoDao.findByProperty(beanName, "bdgid", bdgid);
		if (list.size() > 0){
			flag = true;
		}
		return flag;
	}
	
	/**
	 * 判断要被删除的概算节点是否含有子節點
	 * @param bdgid
	 * @return
	 */
	public boolean isHasChilds(String bdgid){
		boolean flag = false;
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO);
		List list =  this.bdgInfoDao.findByProperty(beanName, "parent", bdgid);
		if (list.size() > 0){
			flag = true;
		}
		return flag;
	}
	
	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 * @author: zhangh
	 * @createDate: 2011-4-7
	 */
	public InputStream getExcelTemplate(String businessType){
		InputStream ins = null;
		String templateSql = "select fileid from app_template t where templatecode='" + businessType + "' order by lastmodify desc";
		List<Map<String, String>> l = JdbcUtil.query(templateSql);
		String templateFileId = "";
		if (l.size()>0) {
			templateFileId = l.get(0).get("fileid");
		}
		
		if (templateFileId!=null && templateFileId.length()>0) {
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet rs = null;
				rs = stmt.executeQuery("SELECT BLOB FROM APP_BLOB WHERE FILEID ='"+templateFileId+"'");
				if(rs.next()) {
					BLOB blob = (BLOB) rs.getBlob(1);
					ins = blob.getBinaryStream();
				}
				rs.close() ;
				stmt.close() ;
				conn.close() ;
				initCtx.close() ;
				
			} catch (Exception ex) {
				ex.printStackTrace();
				return null ;
			}
		}
		return ins;
	}
	
	/**
	 * 概算项目的一键平衡功能： 设置概算金额、预计未签订金额 为累计计算值；
	 * 新增批准概算金额，也需要设置
	 * @param pid	项目ID
	 * @param flag	分两种情况： 1   设置概算金额、预计未签订金额 ， 2  只设置批准概算金额
	 * @return
	 */
	public boolean clearBdgMoney(String pid, String flag) {
		String sql = "";
		if(flag.equals("1")){
			sql="update bdg_info b set b.bdgmoney=b.bdgmoney_cal, b.REMAININGMONEY=b.REMAININGMONEY_CAL where b.pid='"+pid+"'";
		}else {
			sql="update bdg_info t set t.ratifybdg = t.ratifybdg_cal where t.pid='"+pid+"'";
		}
		int num=JdbcUtil.update(sql);
		if(num>0 && flag.equals("1")){
			List list = new ArrayList();
			PcDataExchange pcDataExchange = new PcDataExchange();
			pcDataExchange.setSqlData(sql);
			pcDataExchange.setKeyValue(pid);
			String txGroup = SnUtil.getNewID("tx-");
			pcDataExchange.setTxGroup(txGroup);
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			pcDataExchange.setXh(dataExchangeService.getNewExchangeXh(pid));
			pcDataExchange.setPid(pid);
			pcDataExchange.setTableName("AAA");
			pcDataExchange.setSuccessFlag("0");
			list.add(pcDataExchange);
			dataExchangeService.addExchangeListToQueue(list);
			return true;
		}
		return false;
	}

	/**
	 * 检查概算结构是否需要初始化： 如果当前项目单位没有概算项目信息，则允许初始化
	 * @param parentId
	 * @param pid
	 * @return 0:需要进行初始化；0已有数据，无需初始化；
	 */
	public String checkBdgInit(String parentId, String pid) {
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and pid = '%s' order by bdgid";
		str = String.format(str, parentId, pid);
		List<BdgInfo> obj =null;
		if("0".equals(parent)||"root".equals(parent))
			obj=this.bdgInfoDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), str);
		if(("0".equals(parent)||"root".equals(parent)) && (obj==null || obj.isEmpty())){
		   return "0";
		}
		return "1";
	}

	@SuppressWarnings("unchecked")
	public void initBdgTree(String parentId, String pid) {
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and pid = '%s' order by bdgid";
		str = String.format(str, parentId, pid);
		List<BdgInfo> obj =null;
		if("0".equals(parent)||"root".equals(parent))
		obj=this.bdgInfoDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), str);
		if(("0".equals(parent)||"root".equals(parent))&&obj!=null&&obj.isEmpty()){
			//添加根节点
			BdgInfo  root = new BdgInfo();
			root.setPid(pid);//设置PID
			root.setBdgmoney((double)0);
			root.setBdgmoneyCal((double)0);
			root.setBdgno("01");//root 
			root.setBdgname("工程概算");
			root.setIsleaf((long)0);
			root.setParent("0");
			root.setFlag("0");
			String rparent1=this.bdgInfoDao.insert(root);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(BdgInfo.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgInfo.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd.setPctableuids(root.getBdgid());
			pdd.setPcurl(DynamicDataUtil.BDG_INFO_URL);
			pdd.setPid(root.getPid());
			this.bdgInfoDao.insert(pdd);
			BdgInfo  root1 = new BdgInfo();
			root1.setPid(pid);//设置PID
			root1.setBdgmoney((double)0);
			root1.setBdgmoneyCal((double)0);			
			root1.setBdgno("0101");//root 
			root1.setBdgname("建筑部分");
			root1.setIsleaf((long)1);
			root1.setParent(rparent1);
			root1.setFlag("0");
			this.bdgInfoDao.insert(root1);
			PcDynamicData  pdd1 = new PcDynamicData();
			pdd1.setPcdynamicdate(new Date());
			pdd1.setPctablebean(BdgInfo.class.getName());
			pdd1.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgInfo.class.getName()));
			pdd1.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd1.setPctableuids(root1.getBdgid());
			pdd1.setPcurl(DynamicDataUtil.BDG_INFO_URL);
			pdd1.setPid(root1.getPid());
			this.bdgInfoDao.insert(pdd1);
			BdgInfo  root2 = new BdgInfo();
			root2.setPid(pid);
			root2.setBdgmoney((double)0);
			root2.setBdgmoneyCal((double)0);			
			root2.setBdgno("0102");//root 
			root2.setBdgname("设备部分");
			root2.setIsleaf((long)1);
			root2.setParent(rparent1);
			root2.setFlag("0");
			this.bdgInfoDao.insert(root2);
			PcDynamicData  pdd2 = new PcDynamicData();
			pdd2.setPcdynamicdate(new Date());
			pdd2.setPctablebean(BdgInfo.class.getName());
			pdd2.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgInfo.class.getName()));
			pdd2.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd2.setPctableuids(root2.getBdgid());
			pdd2.setPcurl(DynamicDataUtil.BDG_INFO_URL);
			pdd2.setPid(root2.getPid());
			this.bdgInfoDao.insert(pdd2);
			BdgInfo  root3 = new BdgInfo();
			root3.setPid(pid);
			root3.setBdgmoney((double)0);
			root3.setBdgmoneyCal((double)0);			
			root3.setBdgno("0103");//root 
			root3.setBdgname("安装部分");
			root3.setIsleaf((long)1);
			root3.setParent(rparent1);
			root3.setFlag("0");
			this.bdgInfoDao.insert(root3);
			PcDynamicData  pdd3 = new PcDynamicData();
			pdd3.setPcdynamicdate(new Date());
			pdd3.setPctablebean(BdgInfo.class.getName());
			pdd3.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgInfo.class.getName()));
			pdd3.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd3.setPctableuids(root3.getBdgid());
			pdd3.setPcurl(DynamicDataUtil.BDG_INFO_URL);
			pdd3.setPid(root3.getPid());
			this.bdgInfoDao.insert(pdd3);
			BdgInfo  root4 = new BdgInfo();
			root4.setPid(pid);
			root4.setBdgmoney((double)0);
			root4.setBdgmoneyCal((double)0);			
			root4.setBdgno("0104");//root 
			root4.setBdgname("其他部分");
			root4.setIsleaf((long)1);
			root4.setParent(rparent1);
			root4.setFlag("0");
			this.bdgInfoDao.insert(root4);
			PcDynamicData  pdd4 = new PcDynamicData();
			pdd4.setPcdynamicdate(new Date());
			pdd4.setPctablebean(BdgInfo.class.getName());
			pdd4.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgInfo.class.getName()));
			pdd4.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd4.setPctableuids(root4.getBdgid());
			pdd4.setPcurl(DynamicDataUtil.BDG_INFO_URL);
			pdd4.setPid(root4.getPid());
			this.bdgInfoDao.insert(pdd4);
			List dataList = new ArrayList();
			dataList.add(root);
			dataList.add(root1);
			dataList.add(root2);
			dataList.add(root3);
			dataList.add(root4);
			dataList.add(pdd);
			dataList.add(pdd1);
			dataList.add(pdd2);
			dataList.add(pdd3);
			dataList.add(pdd4);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,root.getPid(),"","","初始化概算树");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
		}
	}
	
	/**
	 *  获得概算结构 - 树
	 *  扩展的treeGrid
	 */
	public List<ColumnTreeNode> budgetMaintenanceTree(String orderBy,
			Integer start, Integer limit, HashMap map) {
		List<VBdgInfo> list = new ArrayList();
		       //页面定义处的参数
		String  parent=(String)map.get("parent");
		       //页面定义处的参数
		String pid=(String)map.get("pid");
		       //拼装一般查询语句
	    list =bdgInfoDao.findByWhere(VBdgInfo.class.getName(), " parent='"+parent+"' and pid='"+pid+"'","bdgno");
			    //对查询语句的返回值进行处理，
				//其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
				//isleaf是根据当前实体Bean 中的属性进行定义
				//如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
				//如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置
				//则页面显示复选框及是否选中状态
	    List newList=DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}

	/**
	 * 初始化预计未签订金额
	 * @param pid
	 * @param UNPid
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-4-26
	 */
	public String initializationAction(String pid,String UNPid) {
	    String initRemainingMoenySql = "update bdg_info b1 set b1.remainingmoney = b1.bdgmoney-(select t2.conbdgappmoney from v_bdg_info t2 where t2.BDGID = b1.bdgid) where b1.pid = '" + pid + "' ";
	    int updateNum = JdbcUtil.update(initRemainingMoenySql);
	    
//	    数据交换
	    if(updateNum==0){
	    	return "faile";
	    } else {
	    	List<BdgInfo>  BdgInfolist = new ArrayList<BdgInfo>();
	    	BdgInfolist = bdgInfoDao.findByWhere(BdgInfo.class.getName(), "pid='"+pid+"'");
	    	if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
	    		List<PcDataExchange> listInQueue = new ArrayList<PcDataExchange>();
	    		PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
	    		listInQueue = exchangeServiceImp.getExcDataList(BdgInfolist, Constant.DefaultOrgRootID, pid,null, null,"初始化未签订合同金额");
	    		Map<String, String> retVal = exchangeServiceImp.sendExchangeData(listInQueue);
	    		String result = retVal.get("result");
	    		return result;
	    	} else {
	    		return "";
	    	}
	    }
	}
	/**
	 * 更新预计未签订金额值
	 * @author: shangtw
	 * @param bdgids
	 * @param value 为变化的值
	 */
	public void updaterRemainingMoney(String bdgids[],Double value){
		List dataList = new ArrayList();
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO;
		if(bdgids!=null){
			String pid="";
			for(int i=0;i<bdgids.length;i++){
				Double oldRemainingMoney=0.0;
				Double newRemainingMoney=0.0;				
				BdgInfo bdginfo = (BdgInfo)this.bdgInfoDao.findById(beanName, bdgids[i]);
				if(bdginfo.getRemainingMoney()!=null){
					oldRemainingMoney=bdginfo.getRemainingMoney();	
				}
				if(i==0){
					pid=bdginfo.getPid();
				}
				newRemainingMoney=oldRemainingMoney-value;
				bdginfo.setRemainingMoney(newRemainingMoney);
				this.bdgInfoDao.saveOrUpdate(bdginfo);
				dataList.add(bdginfo);
			}
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","更新预计未签订金额的值");
				dataExchangeService.addExchangeListToQueue(ExchangeList);
			}					
		}

	}
	
	/**
	 * 更新bdginfo表的标识：包括当前节点以及当前节点的所有上层节点
	 * @param bdgid 当前节点
	 * @param newFlag	要更新成的标识
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-4-9
	 */
	public String updateBdginfoFlag (String bdgid, String newFlag) {
		String whereSql = "select t.bdgid from bdg_info t connect by prior  t.parent = t.bdgid " 
	           +" start with t.bdgid='"+bdgid+"'";
		String updateSql = "update bdg_info t  set t.flag='" + newFlag + "'  where t.bdgid in (" + whereSql + ")";
		JdbcUtil.update(updateSql);
		return "OK";
	}
	
	/**
	 * 删除bdginfo表当前节点及其子节点，并递归更新父节点相关金额
	 * @param bdgid 当前节点
	 * @param flag	要更新成的标识
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-5-15
	 */	
	public int deleteChildNodesByCalMoney(String bdgId){
		int flag = 0;  // 删除返回标志: 0为成功，1为失败
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO;
		BdgInfo bdgInfo = (BdgInfo)this.bdgInfoDao.findById(beanName, bdgId);
		
		String parentId = bdgInfo==null ? "" : bdgInfo.getParent();
		
		String whereSql = "select t.* from bdg_info t connect by prior  t.bdgid = t.parent " 
	           +" start with t.bdgid='"+bdgId+"'";	//找到子节点	
		List listP = (List)this.bdgInfoDao.findByProperty(beanName, "parent", parentId);
		
		List list=JdbcUtil.query(whereSql);
		for(int i=0;i<list.size();i++){
			Map m=(Map) list.get(i);
			Object o=m.get("bdgid");
			String bdgidTemp=o.toString();
			BdgInfo bdgInfoTemp = (BdgInfo)this.bdgInfoDao.findById(beanName, bdgidTemp);
			this.bdgInfoDao.delete(bdgInfoTemp);
		}
		
		try {
			this.sumMoneyHandler(bdgInfo.getParent());
			if (listP.size() == 1){
				BdgInfo bdgInfoParent =(BdgInfo) this.bdgInfoDao.findById(beanName,  parentId);
				bdgInfoParent.setIsleaf(new Long(1));
				this.bdgInfoDao.saveOrUpdate(bdgInfoParent);
			}
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				HttpSession  httpSession =WebContextFactory.get().getSession();
				String pid=(String)httpSession.getAttribute(Constant.CURRENTAPPPID);
				List delBdgInfo=bdgInfoDao.getDataAutoCloseSes(" select * from  bdg_info     start with  bdgid='"+parentId+"' and pid='"+pid+"' connect by prior  parent =bdgid and pid='"+pid+"'");
				List dataList = new ArrayList();
				dataList.add(bdgInfo);
				for(int i=0;i<delBdgInfo.size();i++){
					Object [] objs = (Object [])delBdgInfo.get(i);
					BdgInfo  bdg = new BdgInfo();
					bdg.setBdgid((String)objs[0]);
					dataList.add(bdg);
				}
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","删除概算结构树节点");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}

	/**
	 * 新增或修改概算信息并计算金额
	 * @param BdgInfo 当前概算实体
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-5-15
	 */	
	@SuppressWarnings("unchecked")
	public int addOrUpdateByCalMoney(BdgInfo bdgInfo){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO;
		
		String where =" pid='"+bdgInfo.getPid()+"' and bdgno='"+bdgInfo.getBdgno()+"' ";
		if(!"".equals(bdgInfo.getBdgid())){
			where+=" and bdgid !='"+bdgInfo.getBdgid()+"'";
		}
		List listBdgno=bdgInfoDao.findByWhere(beanName, where);
		if(listBdgno.isEmpty()){
		try {
			 bdgInfo.setBdgmoneyCal(bdgInfo.getBdgmoney());
			 if ("".equals(bdgInfo.getBdgid())){   //  新增
				List list = (List)this.bdgInfoDao.findByProperty(beanName, "parent", bdgInfo.getParent());
				if (list.isEmpty()){
					BdgInfo parentBdg = (BdgInfo)this.bdgInfoDao.findById(beanName, bdgInfo.getParent());
					parentBdg.setIsleaf(new Long(0));
					parentBdg.setBdgflag(new Long(1));
					this.updateBdgInfo(parentBdg);
				}
				this.insertBdgInfo(bdgInfo);
			}else{
				this.updateBdgInfo(bdgInfo);
			}
			this.sumMoneyHandler(bdgInfo.getParent());
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				 List dataList = new ArrayList();
				 List l= bdgInfoDao.getDataAutoCloseSes("select * from  bdg_info  " +
				 		" start with  bdgid='"+bdgInfo.getBdgid()+"' and pid='"+bdgInfo.getPid()+"' " +
				 		" connect by prior parent =bdgid  and pid='"+bdgInfo.getPid()+"'");
				 for(int i=0;i<l.size();i++){
					 Object [] objs = (Object [])l.get(i);
					 BdgInfo  bdg = new BdgInfo();
					 bdg.setBdgid((String)objs[0]);
					 dataList.add(bdg);
					 PcDynamicData  pdd = new PcDynamicData();
					 pdd.setPcdynamicdate(new Date());
					 pdd.setPctablebean(BdgInfo.class.getName());
					 pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgInfo.class.getName()));
					 pdd.setPcurl(DynamicDataUtil.BDG_INFO_URL);
					 pdd.setPid(bdgInfo.getPid());
					 pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					 pdd.setPctableuids((String)objs[0]);
					 bdgInfoDao.insert(pdd);
					 dataList.add(pdd);
				 }
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgInfo.getPid(),"","","新增或修改结算树");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
		} catch (SQLException e) {
			flag = 1; 
			e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; 
			e.printStackTrace();
		}
		}else {
			flag=2;
		}
		return flag;
	}
}
