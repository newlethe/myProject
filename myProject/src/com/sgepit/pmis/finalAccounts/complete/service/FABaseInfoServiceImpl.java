package com.sgepit.pmis.finalAccounts.complete.service;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.hibernate.Session;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BdgProject;
import com.sgepit.pmis.budget.hbm.VBdgConApp;
import com.sgepit.pmis.budget.hbm.VBdgInfo;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.finalAccounts.complete.dao.FACompleteDAO;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompBdgInfo;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompFixedAssetList;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompFixedAssetTree;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFinanceSubject;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompGcType;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompInfoOve;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompUncompCon;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompProofInfo;
/**
 * 基本信息实现类，包括 项目基本信息，概算体系，未完工工程管理 三个模块
 * @author pengy
 * @createtime 2013-6-26 11:45:00
 */
public class FABaseInfoServiceImpl implements FABaseInfoService {
	
	private FACompleteDAO faCompleteDAO;

	public FACompleteDAO getFaCompleteDAO() {
		return faCompleteDAO;
	}

	public void setFaCompleteDAO(FACompleteDAO faCompleteDAO) {
		this.faCompleteDAO = faCompleteDAO;
	}
	
	/**
	 * 通过session获取pid，可以不从前台传递
	 * @return
	 * @author zhangh 2013-7-30
	 */
	public String getPid() {
		String pid = "";
		WebContext webContext = WebContextFactory.get();    
		if(webContext!=null){
			HttpSession session = webContext.getSession() ;
			pid = session.getAttribute(Constant.CURRENTAPPPID).toString(); 
		}
		return pid;
	}

	/**
	 * 获取工程项目概况对象
	 * @param	項目Id
	 * @return 工程概况对象，若没有记录返回null
	 */
	@SuppressWarnings("unchecked")
	public FACompInfoOve getCompInfoOve(String pid) {
		List<FACompInfoOve> obj = faCompleteDAO.findByProperty(FACompInfoOve.class.getName(), "pid", pid);
		return obj != null && obj.size() > 0 ? (FACompInfoOve) obj.get(0) : null;
	}

	/**
	 * 保存工程项目概况对象
	 * @param prjInfoOve
	 */
	public void saveOrUpdate(FACompInfoOve prjInfoOve) {
		if ( null != prjInfoOve.getUids() && ! "".equals(prjInfoOve.getUids())){
			faCompleteDAO.saveOrUpdate(prjInfoOve);
			return;
		}
		faCompleteDAO.insert(prjInfoOve);
	}

	/**
	 * 通用更新bean方法，根据传入实体的类型保存到相应的table
	 * @param objects bean数组
	 * @throws BusinessException
	 */
	public void saveOrUpdate(Object[] objects) throws BusinessException {
		for (Object obj : objects) {
			faCompleteDAO.saveOrUpdate(obj);
		}
	}

	/**
	 * 获得竣工决算概算 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	竣工决算概算表集合
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<ColumnTreeNode> budgetTree(String orderBy, Integer start, Integer limit, HashMap map) {
			List<FACompBdgInfo> list = new ArrayList<FACompBdgInfo>();
			//页面定义的参数
			String parent=(String)map.get("parent");
			String pid=(String)map.get("pid");
		    list = faCompleteDAO.findByWhere(FACompBdgInfo.class.getName(),
		    		" parentid = '" + parent + "' and pid = '" + pid + "'", "uids");
		    //对查询语句的返回值进行处理，
			//其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
			//isleaf是根据当前实体Bean 中的属性进行定义
			//如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
			//如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置,则页面显示复选框及是否选中状态
		    //如果为空，则初始化一个根节点进去
		    if(parent.equals("0") && (null == list || list.size() == 0)){
		    	FACompBdgInfo root = new FACompBdgInfo();
		    	root.setPid(pid);
		    	root.setParentid("0");
		    	root.setBdgname("工程竣工决算概算");
		    	root.setTreeid("01");
		    	root.setBdgno("01");
		    	root.setIsleaf(1L);
				root.setUids(UUID.randomUUID().toString());
		    	faCompleteDAO.insert(root);
		    	list.add(root);
		    }
			for (FACompBdgInfo bdgInfo : list) {
				setExtendAttributes(bdgInfo);
			}
			List newList= DynamicDataUtil.changeisLeaf(list, "isleaf");
			return newList;
	}

	/**
	 * 为竣建概算结构对象设置扩展属性（各个部分金额及名称）
	 * @param bdgInfo	竣工决算概算对象
	 */
	@SuppressWarnings("unchecked")
	public void setExtendAttributes(FACompBdgInfo bdgInfo) {
		// 建筑
		if (bdgInfo.getBuildbdg() != null) {
			BdgInfo sysBdgInfo = (BdgInfo) faCompleteDAO.findById(
					BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO, bdgInfo.getBuildbdg());
			bdgInfo.setBuildno(sysBdgInfo.getBdgno());
			bdgInfo.setBuildname(sysBdgInfo.getBdgname());
			bdgInfo.setBuildmoney(sysBdgInfo.getBdgmoney());
		}else if (bdgInfo.getIsleaf() == 0L){
			String sql = "select nvl(sum(b.bdgmoney),0) from bdg_info b where b.bdgid in (select " +
				"t.buildbdg from facomp_bdg_info t where t.treeid like '" + bdgInfo.getTreeid() + "%')";
			List<BigDecimal> buildmon = faCompleteDAO.getDataAutoCloseSes(sql);
			bdgInfo.setBuildmoney(buildmon.get(0).doubleValue());
		}

		// 设备
		if (bdgInfo.getEquipbdg() != null) {
			BdgInfo sysBdgInfo = (BdgInfo) faCompleteDAO.findById(
					BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO, bdgInfo.getEquipbdg());
			bdgInfo.setEquipno(sysBdgInfo.getBdgno());
			bdgInfo.setEquipname(sysBdgInfo.getBdgname());
			bdgInfo.setEquipmoney(sysBdgInfo.getBdgmoney());
		}else if (bdgInfo.getIsleaf() == 0L){
			String sql = "select nvl(sum(b.bdgmoney),0) from bdg_info b where b.bdgid in (select " +
					"t.equipbdg from facomp_bdg_info t where t.treeid like '" + bdgInfo.getTreeid() + "%')";
			List<BigDecimal> equipmon = faCompleteDAO.getDataAutoCloseSes(sql);
			bdgInfo.setEquipmoney(equipmon.get(0).doubleValue());
		}

		// 安装
		if (bdgInfo.getInstallbdg() != null) {
			BdgInfo sysBdgInfo = (BdgInfo) faCompleteDAO.findById(
					BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO, bdgInfo.getInstallbdg());
			bdgInfo.setInstallno(sysBdgInfo.getBdgno());
			bdgInfo.setInstallname(sysBdgInfo.getBdgname());
			bdgInfo.setInstallmoney(sysBdgInfo.getBdgmoney());
		}else if (bdgInfo.getIsleaf() == 0L){
			String sql = "select nvl(sum(b.bdgmoney),0) from bdg_info b where b.bdgid in (select " +
					"t.installbdg from facomp_bdg_info t where t.treeid like '" + bdgInfo.getTreeid() + "%')";
			List<BigDecimal> installmon = faCompleteDAO.getDataAutoCloseSes(sql);
			bdgInfo.setInstallmoney(installmon.get(0).doubleValue());
		}

		// 其它
		if (bdgInfo.getOtherbdg() != null) {
			BdgInfo sysBdgInfo = (BdgInfo) faCompleteDAO.findById(
					BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO, bdgInfo.getOtherbdg());
			bdgInfo.setOtherno(sysBdgInfo.getBdgno());
			bdgInfo.setOthername(sysBdgInfo.getBdgname());
			bdgInfo.setOthermoney(sysBdgInfo.getBdgmoney());
		}else if (bdgInfo.getIsleaf() == 0L){
			String sql = "select nvl(sum(b.bdgmoney),0) from bdg_info b where b.bdgid in (select " +
					"t.otherbdg from facomp_bdg_info t where t.treeid like '" + bdgInfo.getTreeid() + "%')";
			List<BigDecimal> othermon = faCompleteDAO.getDataAutoCloseSes(sql);
			bdgInfo.setOthermoney(othermon.get(0).doubleValue());
		}
	}
	
	/**
	 * 获得竣工决算工程类型 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	竣工决算工程类型表集合
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<ColumnTreeNode> gcTypeTree(String orderBy, Integer start, Integer limit, HashMap map) {
			List<FACompGcType> list = new ArrayList<FACompGcType>();
			//页面定义的参数
			String parent=(String)map.get("parent");
			String pid=(String)map.get("pid");
		    list = faCompleteDAO.findByWhere(FACompGcType.class.getName(),
		    		" pid = '" + pid + "' and parentid = '" + parent + "'", "uids");
		    //对查询语句的返回值进行处理，
			//其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
			//isleaf是根据当前实体Bean 中的属性进行定义
			//如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
			//如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置,则页面显示复选框及是否选中状态
		    //如果为空，则初始化一个根节点进去
		    if(parent.equals("0") && (null == list || list.size() == 0)){
		    	FACompGcType root = new FACompGcType();
		    	root.setPid(pid);
		    	root.setParentid("0");
		    	root.setGcTypeName("工程类型维护");
		    	root.setTreeid("01");
		    	root.setGcTypeBm("01");
		    	root.setIsleaf(1L);
				root.setUids(UUID.randomUUID().toString());
		    	faCompleteDAO.insert(root);
		    	list.add(root);
		    }
		    List newList= DynamicDataUtil.changeisLeaf(list, "isleaf");
			return newList;
	}
	
	/**
	 * 获得概算关联 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	竣工决算工程类型表集合
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<ColumnTreeNode> VBdgTree(String orderBy, Integer start, Integer limit, HashMap map) {
			List<VBdgInfo> list = new ArrayList<VBdgInfo>();
			//页面定义的参数
			String parent = (String)map.get("parent");
			String pid = (String)map.get("pid");
			String proof = (String)map.get("proof");
			//凭证管理中用到，参数为proof == y
			if (proof == null || !proof.equals("y")){
				//此处将parent作为显示的概算根节点的编码
				if(parent.equals(pid + "-0101") || parent.equals(pid + "-0102")
						|| parent.equals(pid + "-0103") || parent.equals(pid + "-0104")){
					List<VBdgInfo> root = faCompleteDAO.findByWhere(VBdgInfo.class.getName(),
							"pid = '" + pid + "' and bdgid = '" + parent + "'", "bdgno");
					if(root != null && root.size() > 0)
						list.add(root.get(0));
				}
			}
			List<VBdgInfo> list1 = faCompleteDAO.findByWhere(VBdgInfo.class.getName(),
		    		"pid = '" + pid + "' and parent = '" + parent + "'", "bdgno");
			list.addAll(list1);
		    //对查询语句的返回值进行处理，
			//其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
			//isleaf是根据当前实体Bean 中的属性进行定义
			//如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
			//如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置,则页面显示复选框及是否选中状态
//			for (VBdgInfo vbdgInfo : list) {
//				List<FACompBdgInfo> lt = this.faCompleteDAO.findByWhere(FACompBdgInfo.class.getName(),
//						"buildbdg='" + vbdgInfo.getBdgid() + "' or equipbdg='" + vbdgInfo.getBdgid() +
//						"' or installbdg='"+vbdgInfo.getBdgid()+"' or otherbdg='"+vbdgInfo.getBdgid()+"'");
//				if (lt != null && lt.size() > 0) {
//					vbdgInfo.setIscheck(true);
//				}
//			}
		    List newList= DynamicDataUtil.changeisLeaf(list, "isleaf");
			return newList;
	}

	/**
	 * 获得竣工决算财务科目 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	竣工决算财务科目表集合
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<ColumnTreeNode> financeSubjectTree(String orderBy, Integer start, Integer limit, HashMap map) {
			List<FacompFinanceSubject> list = new ArrayList<FacompFinanceSubject>();
			//页面定义的参数
			String parent=(String)map.get("parent");
			String pid=(String)map.get("pid");
		    list = faCompleteDAO.findByWhere(FacompFinanceSubject.class.getName(),
		    		" pid = '" + pid + "' and parentid = '" + parent + "'", "uids");
		    //对查询语句的返回值进行处理，
			//其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
			//isleaf是根据当前实体Bean 中的属性进行定义
			//如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
			//如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置,则页面显示复选框及是否选中状态
		    //如果为空，则初始化一个根节点进去
		    if(parent.equals("0") && (null == list || list.size() == 0)){
		    	FacompFinanceSubject root = new FacompFinanceSubject();
		    	root.setPid(pid);
		    	root.setParentid("0");
		    	root.setSubjectName("财务科目");
		    	root.setTreeid("01");
		    	root.setSubjectBm("01");
		    	root.setIsleaf(1L);
				root.setUids(UUID.randomUUID().toString());
		    	faCompleteDAO.insert(root);
		    	list.add(root);
		    }
		    List newList= DynamicDataUtil.changeisLeaf(list, "isleaf");
			return newList;
	}

	/**
	 * 验证竣工决算概算管理选择的概算是否已存在
	 * @param pid	项目ID
	 * @param uids	主键
	 * @param name	字段名称（设备，设备，安装，其他）
	 * @param value	选择的概算NO
	 * @return	true 未重复，false 已存在
	 */
	@SuppressWarnings("unchecked")
	public String checkBdgno(String pid, String uids, String name, String value){
		List<FACompBdgInfo> bdgInfo = this.faCompleteDAO.findByWhere2(FACompBdgInfo.class.getName(),
				"pid = '" + pid + "' and " + name + " = '" + value + "'");
		if(bdgInfo != null && bdgInfo.size() > 0){
			if(uids != null && !"".equals(uids)){
				if(!uids.equals(bdgInfo.get(0).getUids())){
					return "false";
				}
			}else{
				return "false";
			}
		}
		return "true";
	}

	/**
	 * 添加或更新节点
	 * @param node	FABdgInfo 竣工决算概算管理表
	 * @param isleaf	父节点是否是叶子节点，新增节点时用到
	 * @return	节点主键,若编号重复返回false
	 */
	@SuppressWarnings("unchecked")
	public String saveOrUpdateNode(FACompBdgInfo node, String isleaf){
		boolean isAdd = node.getUids() == null || node.getUids().equals("")
				? true : false;
		String id = "";
		//验证编号是否重复
		List<FACompBdgInfo> bdgInfo = this.faCompleteDAO.findByProperty(
				FACompBdgInfo.class.getName(), "bdgno", node.getBdgno());
		if (isAdd) {
			if(bdgInfo.size() == 1){
				return "false";
			}
			//获取新的treeid
			String treeid = getNewTreeid(node.getPid(), node.getParentid(), "treeid", "FACOMP_BDG_INFO", null);
			node.setTreeid(treeid);
			id = faCompleteDAO.insert(node);
			if(isleaf.equals("1")){
				String changeLeaf ="update FACOMP_BDG_INFO set isleaf=0 where treeid='"+node.getParentid()+"'";
				JdbcUtil.update(changeLeaf);
			}
		} else {
			if(bdgInfo.size() > 0 && !bdgInfo.get(0).getUids().equals(node.getUids())){
				return "false";
			}
			id = node.getUids();
			/**更新时会报a different object with the same identifier value was already associated with the
			session,不能使用saveorupdate,使用session的merge方法解决*/
			Session session = faCompleteDAO.getHibernateTemplate().getSessionFactory().getCurrentSession();
			session.merge(node);
		}
		return id;
	}

	/**
	 * 添加或保存节点
	 * @param node	FAGcType 工程类型管理表
	 * @param isleaf	父节点是否是叶子节点，新增节点时用到
	 * @return	节点主键,若编号重复返回false
	 */
	@SuppressWarnings("unchecked")
	public String saveOrUpdateNode(FACompGcType node, String isleaf){
		boolean isAdd = null == node.getUids() || node.getUids().equals("")
				? true : false;
		String id = "";
		//验证编号是否重复
		List<FACompGcType> gcType = this.faCompleteDAO.findByProperty(
				FACompGcType.class.getName(), "gcTypeBm", node.getGcTypeBm());
		if (isAdd) {
			if(gcType.size() == 1){
				return "false";
			}
			//获取新的treeid
			String treeid = getNewTreeid(node.getPid(), node.getParentid(), "treeid", "FACOMP_GC_TYPE", null);
			node.setTreeid(treeid);
			id = faCompleteDAO.insert(node);
			if(isleaf.equals("1")){
				String changeLeaf ="update FACOMP_GC_TYPE set isleaf=0 where treeid='"+node.getParentid()+"'";
				JdbcUtil.update(changeLeaf);
			}
		} else {
			if(gcType.size() > 0 && !gcType.get(0).getUids().equals(node.getUids())){
				return "false";
			}
			id = node.getUids();
			/**更新时会报a different object with the same identifier value was already associated with the
			session,不能使用saveorupdate,使用session的merge方法解决*/
			Session session = faCompleteDAO.getHibernateTemplate().getSessionFactory().getCurrentSession();
			session.merge(node);
		}
		return id;
	}

	/**
	 * 添加或保存节点
	 * @param node	FAGcType 工程类型管理表
	 * @param isleaf	父节点是否是叶子节点，新增节点时用到
	 * @return	节点主键,若编号重复返回false
	 */
	@SuppressWarnings("unchecked")
	public String saveOrUpdateNode(FacompFinanceSubject node, String isleaf){
		boolean isAdd = null == node.getUids() || node.getUids().equals("")
				? true : false;
		String id = "";
		//验证编号是否重复
		List<FacompFinanceSubject> subject = this.faCompleteDAO.findByProperty(
				FacompFinanceSubject.class.getName(), "subjectBm", node.getSubjectBm());
		if (isAdd) {
			if(subject.size() == 1){
				return "false";
			}
			//获取新的treeid
			String treeid = getNewTreeid(node.getPid(), node.getParentid(), "treeid", "FACOMP_FINANCE_SUBJECT", null);
			node.setTreeid(treeid);
			id = faCompleteDAO.insert(node);
			if(isleaf.equals("1")){
				String changeLeaf ="update FACOMP_FINANCE_SUBJECT set isleaf=0 where treeid='"+node.getParentid()+"'";
				JdbcUtil.update(changeLeaf);
			}
		} else {
			if(subject.size() > 0 && !subject.get(0).getUids().equals(node.getUids())){
				return "false";
			}
			id = node.getUids();
			FacompFinanceSubject oldsub = (FacompFinanceSubject) this.faCompleteDAO.findById(FacompFinanceSubject.class.getName(), node.getUids());
			String oldAllname = oldsub.getSubjectAllname();
			if (!node.getSubjectAllname().equals(oldAllname)){
				String sql = "treeid like '" + node.getTreeid() + "%'";
				List<FacompFinanceSubject> list = this.faCompleteDAO.findByWhere(FacompFinanceSubject.class.getName(), sql);
				if(list != null && list.size() > 0){
					for (FacompFinanceSubject sub : list){
						String newAllname = sub.getSubjectAllname().replaceAll(oldAllname, node.getSubjectAllname());
						sub.setSubjectAllname(newAllname);
						this.faCompleteDAO.saveOrUpdate(sub);
					}
				}
			}
			/**更新时会报a different object with the same identifier value was already associated with the
			session,不能使用saveorupdate,使用session的merge方法解决*/
			Session session = faCompleteDAO.getHibernateTemplate().getSessionFactory().getCurrentSession();
			session.merge(node);
		}
		return id;
	}

	/**
	 * 竣工决算模块树结构新增时获取新的节点编号
	 * @param pid PID
	 * @param prefix 编号前缀
	 * @param col 列名称
	 * @param table 表名称
	 * @param lsh 最大的流水号（可手动传入。null，表示没有传入，需要从数据库中获取）
	 * @return
	 * @author zhangh 2013-06-27
	 */
	@SuppressWarnings("unchecked")
	public String getNewTreeid(String pid, String prefix, String col, String table, Long lsh) {
		String bh = "";
		String newLsh = "";
		if (lsh == null) {
			String sql = "select trim(to_char(nvl(max(substr(" + col + ",length('" + prefix +
					"') +1, 2)),0) +1,'00')) from " + table + " where pid = '" + pid + 
					"' and  substr(" + col + ",1,length('" + prefix + "')) ='" + prefix + "'";
			List<String> list = this.faCompleteDAO.getDataAutoCloseSes(sql);
			if (list != null) {
				newLsh = list.get(0);
			}
		} else {
			NumberFormat ft = NumberFormat.getNumberInstance();
			ft.setMinimumIntegerDigits(4);
			ft.setGroupingUsed(false);
			newLsh = ft.format(lsh);
		}
		bh = prefix.concat(newLsh);
		return bh;
	}
	
	/**
	 * 删除叶子节点
	 * @param beanType	实体类简称
	 * @param id		节点主键
	 * @param parentid	父节点
	 */
	@SuppressWarnings("unchecked")
	public void deleteNode(String beanType, String id, String parentid) {
		String tableName = "";
		if(beanType.equals("gcType")){
			tableName = "FACOMP_GC_TYPE";
			FACompGcType gcType = (FACompGcType)this.faCompleteDAO.findById(FACompGcType.class.getName(),id);
			faCompleteDAO.delete(gcType);
		} else if (beanType.equals("faBdgInfo")) {
			tableName = "FACOMP_BDG_INFO";
			FACompBdgInfo bdgInfo = (FACompBdgInfo)this.faCompleteDAO.findById(FACompBdgInfo.class.getName(),id);
			faCompleteDAO.delete(bdgInfo);
		} else if (beanType.equals("subject")) {
			tableName = "FACOMP_FINANCE_SUBJECT";
			FacompFinanceSubject subject = (FacompFinanceSubject)this.faCompleteDAO.findById(FacompFinanceSubject.class.getName(),id);
			faCompleteDAO.delete(subject);
		}
		//查询是否还有兄弟节点
		String brother = "select * from " + tableName + " where parentid = '" + parentid + "'";
		List<Object> list = JdbcUtil.query(brother);
		//如果不存在兄弟节点，改变父节点的isLeaf为1
		if(null != list && list.size() == 1){
			String changeLeaf = "update " + tableName + " set isleaf=1 where treeid='" + parentid + "'";
			JdbcUtil.update(changeLeaf);
		}
	}

	/**
	 * 获得未完工合同
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	未完工合同集合
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<FACompUncompCon> getUncompCon(String orderBy, Integer start, Integer limit, HashMap map){
		//页面定义的参数
		String pid = (String)map.get("pid");
		List<FACompUncompCon> conList = new ArrayList<FACompUncompCon>();
		//投资完成总金额
		String totalinvestSql = "(select nvl(sum(m.ratiftmoney), 0) from PRO_ACM_MONTH m where" +
				" m.conid = c.CONID and m.PID = '" + pid + "' and m.audit_state = '1')";
		//这里没有加合同状态billstate的过滤条件
		String uncompConSql = "select c.CONID,c.CONNO,c.CONNAME,c.CONMONEY,c.CONVALUEMONEY," + totalinvestSql
				+ " as TOTALINVEST from V_CON c, PRO_ACM_MONTH t where c.CONDIVNO = 'SG' and c.PID = '" + pid
				+ "' and c.CONID = t.conid and t.audit_state = '1'  and c.CONVALUEMONEY > " + totalinvestSql;
		List<Map<String, Object>> list = JdbcUtil.query(uncompConSql);
		for(Map<String, Object> conMap : list){
			FACompUncompCon con = new FACompUncompCon();
			con.setConid((String)conMap.get("CONID"));
			con.setPid(pid);
			con.setConmoney(((BigDecimal)conMap.get("CONMONEY")).doubleValue());
//			con.setConmoneyno((String)conMap.get("CONMONEYNO"));
			con.setConname((String)conMap.get("CONNAME"));
			con.setConno((String)conMap.get("CONNO"));
			con.setConvaluemoney(((BigDecimal)conMap.get("CONVALUEMONEY")).doubleValue());
			con.setInvestmoney(((BigDecimal)conMap.get("TOTALINVEST")).doubleValue());
			//查询变更总金额
			String changeMonSql = "select nvl(sum(t.chamoney),0) from CON_CHA t where t.conid = '" +
					con.getConid() + "' and t.PID = '" + pid + "' and t.BILLSTATE = '1'";
			List<BigDecimal> chaList = this.faCompleteDAO.getDataAutoCloseSes(changeMonSql);
			Double cha = chaList != null && chaList.size() > 0 ? chaList.get(0).doubleValue() : 0d;
			con.setChangemoney(cha);
			conList.add(con);
		}
		return conList;
	}

	/**
	 * 工程量清单中的工程量结构 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	工程量集合
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<ColumnTreeNode> buildBdgPrjTree(String orderBy, Integer start, Integer limit, HashMap map){
		List<BdgProject> list = new ArrayList<BdgProject>();
		//装新new的对象，避免对原持久对象set操作，导致hibernate执行update
		List<BdgProject> list2 = new ArrayList<BdgProject>();
		// 页面定义处的参数
		String parent = (String) map.get("parent");
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		String conid = (String) map.get("conid");
		String bdgid = (String) map.get("bdgid");
		
		// 拼装一般查询语句
		list = this.faCompleteDAO.findByWhere(BdgProject.class.getName(),
				" parent='" + parent + "' and pid='" + pid + "' and conid='"
				+ conid + "' and bdgid = '" + bdgid + "' ", "treeid");
		for(BdgProject bdgPrj : list){
			BdgProject bdgPrj2 = new BdgProject();
			bdgPrj2.setProappid(bdgPrj.getProappid());
			bdgPrj2.setPid(pid);
			bdgPrj2.setConid(bdgPrj.getConid());
			bdgPrj2.setBdgid(bdgPrj.getBdgid());
			bdgPrj2.setProno(bdgPrj.getProno());
			bdgPrj2.setProname(bdgPrj.getProname());
			bdgPrj2.setUnit(bdgPrj.getUnit());
			bdgPrj2.setPrice(bdgPrj.getPrice());
			bdgPrj2.setAmount(bdgPrj.getAmount());
			//获取施工单位名称
			String constrName = "";
			if(bdgPrj.getConstructionUnit() != null && !"".equals(bdgPrj.getConstructionUnit())){
				String constrSql =
						"select c.property_name from property_code c where c.property_code = '" +
						bdgPrj.getConstructionUnit() + "' and c.type_name =" +
						"(select t.uids from property_type t where t.type_name = '工程量施工单位')";
				List<String> constrList = this.faCompleteDAO.getDataAutoCloseSes(constrSql);
				constrName = constrList != null && constrList.size() > 0 ? constrList.get(0) : "";
			}
			bdgPrj2.setConstructionUnit(constrName);
			//获取投资完成工程量
			String investProSql =
					"select v.THIS_MON_COMP from V_CONT_BAL_MANAGE_REPORT v where v.BDGID = '" +
					bdgPrj.getBdgid() + "' and v.MASTER_ID=(select m.uids from Cont_Bal_Manage m where" +
					" m.conid='" + bdgPrj.getConid() + "' and m.PID='" + pid + "' and m.sj_type=(select" +
					" max(ma.sj_type) from Cont_Bal_Manage ma where ma.conid='" + bdgPrj.getConid() +
					"' and ma.PID='" + pid + "' and ma.bill_state = '1'))";
			List<BigDecimal> investProList = this.faCompleteDAO.getDataAutoCloseSes(investProSql);
			Double investPro = investProList != null && investProList.size() > 0
						? investProList.get(0).doubleValue() : 0d;
			bdgPrj2.setInvestCompProapp(investPro);
			list2.add(bdgPrj2);
		}
		// 对查询语句的返回值进行处理，
		// 其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
		// isleaf是根据当前实体Bean 中的属性进行定义
		// 如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
		// 如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置
		// 则页面显示复选框及是否选中状态
		List newList = DynamicDataUtil.changeisLeaf(list2, "isleaf");
		return newList;
	}

	/**
	 * 构建工程类型的TreeCombo
	 * 
	 * @param treeName	树名称
	 * @param parentId	父节点ID
	 * @param params	参数
	 * @return	树节点集合
	 * @throws BusinessException
	 */
	@SuppressWarnings("rawtypes")
	public List<TreeNode> buildTree(String treeName, String parentId, Map params)
			throws BusinessException {
		List<TreeNode> list = new ArrayList<TreeNode>();
		String parent = ((String[]) params.get("parent"))[0];
		// 设备仓库分类数树新 zhangh
		if (treeName.equalsIgnoreCase("gcTypeColumnTree")) {
			String pid = ((String[]) params.get("pid"))[0];
			list = this.ShowGcTypeColumnTree(parent, pid);
			return list;
		}else if (treeName.equalsIgnoreCase("subjectColumnTree")) {
			String pid = ((String[]) params.get("pid"))[0];
			list = this.ShowSubjectColumnTree(parent, pid);
			return list;
		}
		
		if (treeName.equalsIgnoreCase("bdgProjectGetFACompGcType")) {
			list = this.bdgProjectGetFACompGcType(parent);
			return list;
		}
		if(treeName.equalsIgnoreCase("getFACompFixedAssetTreeNew")){
			String parent1 = ((String[]) params.get("parent"))[0];
			list = this.getFACompFixedAssetTreeNew(parent1);
			return list;
		}
		if(treeName.equalsIgnoreCase("getFACompFixedAssetList")){
			String pid = ((String[]) params.get("pid"))[0];
			list = this.getFACompFixedAssetList(parent, pid);
			return list;
		}
		return null;
	}

	/**
	 * 构建工程类型ColumnTree
	 * @param parentId	父节点ID
	 * @param pid		项目ID
	 * @return	树节点集合
	 */
	@SuppressWarnings("unchecked")
	public List<TreeNode> ShowGcTypeColumnTree(String parentId, String pid) {
		List<TreeNode> list = new ArrayList<TreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: "0";
		String where = " pid = '" + pid + "' and parentid = '" + parent + "' ";
		List<FACompGcType> modules = this.faCompleteDAO.findByWhere(FACompGcType.class
				.getName(), where, "uids");
		Iterator<FACompGcType> itr = modules.iterator();
		try {
			while (itr.hasNext()) {
				TreeNode n = new TreeNode();
				FACompGcType temp = itr.next();
				int leaf = Integer.parseInt(temp.getIsleaf().toString());
				n.setId(temp.getTreeid()); // treenode.id
				n.setText(temp.getGcTypeName()); // treenode.text
				if (leaf == 1) {
					n.setLeaf(true);
					n.setIconCls("icon-cmp");
				} else {
					n.setLeaf(false); // treenode.leaf
					n.setCls("icon-pkg"); // treenode.cls
				}
				list.add(n);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	/**
	 * 构建财务科目ColumnTree
	 * @param parentId	父节点ID
	 * @param pid		项目ID
	 * @return	树节点集合
	 */
	@SuppressWarnings("unchecked")
	public List<TreeNode> ShowSubjectColumnTree(String parentId, String pid) {
		List<TreeNode> list = new ArrayList<TreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: "0";
		String where = " pid = '" + pid + "' and parentid = '" + parent + "' ";
		List<FacompFinanceSubject> modules = this.faCompleteDAO.findByWhere(FacompFinanceSubject.class
				.getName(), where, "uids");
		Iterator<FacompFinanceSubject> itr = modules.iterator();
		try {
			while (itr.hasNext()) {
				TreeNode n = new TreeNode();
				FacompFinanceSubject temp = itr.next();
				int leaf = Integer.parseInt(temp.getIsleaf().toString());
				n.setId(temp.getTreeid()); // treenode.id
				n.setText(temp.getSubjectName()); // treenode.text
				if (leaf == 1) {
					n.setLeaf(true);
					n.setIconCls("icon-cmp");
				} else {
					n.setLeaf(false); // treenode.leaf
					n.setCls("icon-pkg"); // treenode.cls
				}
				list.add(n);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	/**
	 * 保存凭证
	 * @param proof	凭证对象
	 * @return	保存后的主键
	 */
	@SuppressWarnings("unchecked")
	public String saveOrUpdateNode(FacompProofInfo proof) {
		boolean isAdd = proof.getUids() == null || proof.getUids().equals("")
				? true : false;
		String id = "";
		if (isAdd) {
			id = this.faCompleteDAO.insert(proof);
			String relateuids = proof.getRelateuids();
			if(proof.getComptime().length() < 8){
				//只有年月，是施工、其他合同投资完成报表生成凭证
				String sql = "select nvl(sum(t.ratiftmoney),0),t.financial_account from (select p.ratiftmoney,b.financial_account" +
						" from PRO_ACM_INFO p,BDG_PROJECT b where p.proid = b.proappid and b.financial_account is not null and" +
						" p.mon_id = '" + relateuids + "') t group by t.financial_account";
				List<Object[]> list = this.faCompleteDAO.getDataAutoCloseSes(sql);
				if (list != null && list.size() > 0){
					for (int i = 0; i < list.size(); i++){
						FacompProofInfo proofSub = new FacompProofInfo();
						proofSub.setConid(list.get(i)[1].toString());//财务科目treeid
						proofSub.setPid(proof.getPid());
						proofSub.setDetialBh(new Integer(i+1).longValue());//编号
						proofSub.setProofAbstract(proof.getProofNo() + "0" + new Integer(i+1).toString());//凭证号拼接编号
						proofSub.setTotalmoney(((BigDecimal)list.get(i)[0]).doubleValue());//财务科目分类下的本次投资完成之和
						proofSub.setRelateuids(id);//凭证主键
						String subjectSql = "select t.subject_allname from facomp_finance_subject t where t.treeid = '"
								+ list.get(i)[1].toString() + "'";
						List<String> subjectAllname = this.faCompleteDAO.getDataAutoCloseSes(subjectSql);
						proofSub.setComptime(subjectAllname.get(0));//科目全称
						this.faCompleteDAO.insert(proofSub);
					}
				}
			}else {
				//有年月日，是主体设备、主体材料出库单生成凭证
				FacompProofInfo proofSub = new FacompProofInfo();
				proofSub.setPid(proof.getPid());
				proofSub.setDetialBh(1L);//编号
				proofSub.setProofAbstract(proof.getProofNo() + "01");//凭证号拼接编号
				proofSub.setTotalmoney(proof.getTotalmoney());
				proofSub.setRelateuids(id);//凭证主键
				String sql = "select c.condivno from con_ove c where c.conid = '" + proof.getConid() + "'";
				List<String> condivno = this.faCompleteDAO.getDataAutoCloseSes(sql);//合同分类
				String sql2 = "";
				if (condivno.get(0).equals("SB")){
					sql2 = "select t.financial_subjects from equ_goods_stock_out t where t.uids = '" + proof.getRelateuids() + "'";
				}else if (condivno.get(0).equals("CL")){
					sql2 = "select t.financial_subjects from wz_goods_stock_out t where t.uids = '" + proof.getRelateuids() + "'";
				}
				List<String> finance = this.faCompleteDAO.getDataAutoCloseSes(sql2);
				proofSub.setComptime(finance.get(0));//科目全称
				this.faCompleteDAO.insert(proofSub);
			}
		}
		return id;
	}

	/**
	 * 删除凭证及其子数据
	 * @param uids	凭证主键
	 * @return	成功则返回true
	 */
	@SuppressWarnings("unchecked")
	public String deleteProof(String uids) {
		List<FacompProofInfo> list=this.faCompleteDAO.findByWhere(FacompProofInfo.class.getName(), "relateuids = '" + uids + "'");
		this.faCompleteDAO.deleteAll(list);
		FacompProofInfo fpro=(FacompProofInfo) this.faCompleteDAO.findById(FacompProofInfo.class.getName(), uids);
		this.faCompleteDAO.delete(fpro);
		return "true";
	}

	/**
	 * 构造columntree
	 * @param treeName	树名称
	 * @param parentId	父节点ID
	 * @param params	参数
	 * @return			树节点集合
	 * @throws BusinessException
	 */
	@SuppressWarnings("rawtypes")
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if (treeName.equalsIgnoreCase("bdgProjectTree")) { // 概算结构树
			String contId = ((String[]) params.get("conid"))[0];
			list = buildBdgProjectTree(parentId, contId);
			return list;
		}
		return list;
	}

	/**
	 * 合同工程量分摊树
	 * @param parentId	父节点ID
	 * @param conId		合同ID
	 * @return
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> buildBdgProjectTree(String parentId, String conId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String strbma= "parent = '%s' and conid='%s' order by bdgid";
		strbma = String.format(strbma, parentId, conId);
		List<BdgMoneyApp> objectbma = this.faCompleteDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), strbma);
		Iterator<BdgMoneyApp> itrbma = objectbma.iterator();
		String bdgids="";
		while (itrbma.hasNext()) {
			BdgMoneyApp temp = (BdgMoneyApp) itrbma.next();
			bdgids+="'"+temp.getBdgid()+"'"+",";
		}
		if(bdgids!=""){
			bdgids=bdgids.substring(0,bdgids.length()-1);
			bdgids="("+bdgids+")";
		}		
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str="";
		if(bdgids==""){
			str="parent = '%s' and conid = '%s' order by bdgid";
			str = String.format(str, parent, conId);
		}else{
			str="parent = '%s' and conid = '%s' and bdgid in %s order by bdgid";
			str = String.format(str, parent, conId,bdgids);
		}
		List<VBdgConApp> objects = this.faCompleteDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), str);
		String textStr="";
		Iterator<VBdgConApp> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			VBdgConApp temp1 = (VBdgConApp) itr.next();
			VBdgConApp temp = new VBdgConApp();
			try {
				BeanUtils.copyProperties(temp, temp1);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getBdgid());			// treenode.id
			textStr=temp.getBdgname()+"_"+temp.getBdgno();
			n.setText(textStr);		// treenode.text
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

	//======  zhengh  ======
	
	/**
	 * 合同分摊界面新增时，选择工程类型树
	 * @param parentId
	 * @return
	 * @author zhangh 2013-07-26
	 */
	public List<TreeNode> bdgProjectGetFACompGcType(String parentId){
	List<TreeNode> list = new ArrayList<TreeNode>();
	String parent = parentId != null && !parentId.equals("") ? parentId
			: "0";
	String where = " parentid = '" + parentId + "' ";
	List modules = this.faCompleteDAO.findByWhere(FACompGcType.class
			.getName(), where, "treeid");
	Iterator itr = modules.iterator();
	String treeJsonStr = "";
	try {
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			FACompGcType temp = (FACompGcType) itr.next();
			int leaf = Integer.parseInt(temp.getIsleaf().toString());
			n.setId(temp.getTreeid()); // treenode.id
			n.setText(temp.getGcTypeName()); // treenode.text
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("icon-pkg"); // treenode.cls
			}
			list.add(n);
		}
	} catch (Exception e) {
		e.printStackTrace();
	}
	return list;
	}
//************yanglh**********构建一个新的资产分类树********
	public List<TreeNode> getFACompFixedAssetTreeNew(String parentId) {
		List<TreeNode> list = new ArrayList<TreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: "0";
		if(!parentId.equals("01")){
			FACompFixedAssetTree treeParent = (FACompFixedAssetTree) this.faCompleteDAO.findById(FACompFixedAssetTree.class.getName(),parentId);
			parent = treeParent.getTreeid();
		}
		String where = " parentid = '" + parent + "' ";
		List modules = this.faCompleteDAO.findByWhere(FACompFixedAssetTree.class
				.getName(), where, "treeid");
		Iterator itr = modules.iterator();
		String treeJsonStr = "";
		try {
			while (itr.hasNext()) {
				TreeNode n = new TreeNode();
				FACompFixedAssetTree temp = (FACompFixedAssetTree) itr.next();
				int leaf = Integer.parseInt(temp.getIsleaf().toString());
				n.setId(temp.getUids().toString()); // treenode.id
				n.setText(temp.getFixedname().toString()); // treenode.text
				if (leaf == 1) {
					n.setLeaf(true);
					n.setIconCls("icon-cmp");
				} else {
					n.setLeaf(false); // treenode.leaf
					n.setCls("icon-pkg"); // treenode.cls
				}
				list.add(n);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	/**======================固定资产清单树 作treecombo ======================*/
	/**
     * 固定资产清单树
     * @param parentid
     * @param pid
     * @return
     * @author pengy 2013-08-20
     */
	@SuppressWarnings("unchecked")
	public List<TreeNode> getFACompFixedAssetList(String parentid,
			String pid) {
		List<TreeNode> list = new ArrayList<TreeNode>();
		String str = "";
		if (parentid != null && !parentid.equals("")) {
			str = " parentid='" + parentid + "'";
		}
		List<FACompFixedAssetList> list1 = this.faCompleteDAO.findByWhere(
				FACompFixedAssetList.class.getName(), str, "treeid asc");

		for (int i = 0; i < list1.size(); i++) {
			TreeNode n = new TreeNode();
			FACompFixedAssetList assetList = (FACompFixedAssetList) list1
					.get(i);
			Long leaf = assetList.getIsleaf();
			n.setId(assetList.getTreeid()); // treenode.id
			n.setText(assetList.getFixedname()); // treenode.text
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("master-task"); // treenode.cls
				n.setIconCls("icon-pkg"); // treenode.iconCls icon-pkg 文件夹样式
											// task-folder
			}
			list.add(n);
		}
		return list;
	}

}
