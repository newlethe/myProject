package com.sgepit.pmis.equipment.service;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.hibernate.HibernateException;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgProject;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquConOveTreeView;
import com.sgepit.pmis.equipment.hbm.EquGoodsBodys;
import com.sgepit.pmis.equipment.hbm.EquPackStyle;
import com.sgepit.pmis.equipment.hbm.EquTypeTree;
import com.sgepit.pmis.equipment.hbm.EquWarehouse;
import com.sgepit.pmis.equipment.hbm.SbCsb;

public class EquBaseInfoImpl extends BaseMgmImpl implements EquBaseInfoFacade {

	private EquipmentDAO equipmentDAO;
	
	public EquipmentDAO getEquipmentDAO() {
		return equipmentDAO;
	}

	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}

	public static EquBaseInfoImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EquBaseInfoImpl) ctx.getBean("equBaseInfo");
	}
	
	
	//yanglh
	 
	String beanName = "com.sgepit.pmis.equipment.hbm.EquWarehouse";
    /**
     * @设备仓库TreeGrid
     */
	public List<EquWarehouse> equWarehouseGridTree(String orderBy, Integer start, Integer limit, HashMap map) {
		List<EquWarehouse> list = new ArrayList();
		// 页面定义处的参数
		String parent = (String) map.get("parent");
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		if("0".equals(parent)){
			List getList = this.equipmentDAO.findByWhere(EquWarehouse.class.getName()," parent='0' and pid='" + pid + "'", "equid");
			if(getList.size()==0){
				EquWarehouse equWarehouse = new EquWarehouse();
				equWarehouse.setPid(pid);
				equWarehouse.setEquid("01");
				equWarehouse.setEquno("设备仓库信息库区库位编码");
				equWarehouse.setDetailed("设备仓库详细位置描述");
				equWarehouse.setIsleaf(Long.valueOf("1"));
				equWarehouse.setParent("0");
				this.equipmentDAO.insert(equWarehouse);
				}
		}
		list = this.equipmentDAO.findByWhere(EquWarehouse.class.getName(),
				" parent='" + parent + "' and pid='" + pid + "'", "equid");
		List newList = DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
    /**
     *@param equid ,uids
     * 设备仓库删除相关记录
     */
	public int deleteEquWarehouse(String uids,String pid) {
		int flag = 0;
		String beanNamea = BusinessConstants.EQU_PACKAGE.concat("EquGoodsArrivalSub");
		String beanNames = BusinessConstants.EQU_PACKAGE.concat("EquGoodsStoreinSub");
		String getParent="";
		String delUids="";
		String getPid ="";
		String whereSql = "select t.* from equ_warehouse t connect by prior  t.equid = t.parent start with t.equid="
				         +"  (select equid from equ_warehouse where uids='"+uids+"' and pid='"+pid+"')  order by equid";
		List list = JdbcUtil.query(whereSql);
		for(int i=0;i<list.size();i++){//如果节点或其子节点被使用，则不能删除
			Map m=(Map) list.get(i);
			Object o=m.get("uids");
			String uuidTemp=o.toString();
			List aSubList=this.equipmentDAO.findByProperty(beanNamea, "storage", uuidTemp);
			if(aSubList.size()>0){
				flag= 1;
				return flag;
			}
			List sSubList=this.equipmentDAO.findByProperty(beanNames, "equno", uuidTemp);
			if(sSubList.size()>0){
				flag=1;
				return flag;
			}
		}
		for (int i = 0; i < list.size(); i++) {
			Map map = (Map) list.get(i);
			Object deluids = map.get("uids");
			delUids = deluids.toString();
			getPid =  map.get("PID").toString();
			getParent = map.get("PARENT").toString();
			EquWarehouse equWarehouse = (EquWarehouse) this.equipmentDAO
					.findById(beanName, delUids);
			this.judgmentParent(delUids,"del",getParent,getPid);
			this.equipmentDAO.delete(equWarehouse);
		}
		return flag;
	}

	public String addOrUpdateEquWarehouse(EquWarehouse equWarehouse, String equid,String uids)
			throws DataAccessResourceFailureException, HibernateException, IllegalStateException, ClassNotFoundException {
		if ("".equals(equWarehouse.getUids())) {// 新增
			this.equipmentDAO.insert(equWarehouse);
			if (!"0".equals(equWarehouse.getParent())) {
				String whereSql = "select isleaf from equ_warehouse t where t.equid='"
						+ equWarehouse.getParent() + "'";
				List list = JdbcUtil.query(whereSql);
				Map map = (Map) list.get(0);
				Object getIsleaf = map.get("isleaf");
				String isleaf = getIsleaf.toString();
				if (isleaf.equals("1")) {
					this.equipmentDAO.updateBySQL("update equ_warehouse t set t.isleaf='0' where t.equid = '"
									+ equWarehouse.getParent() + "' and pid='"+equWarehouse.getPid()+"'");
				}
			} else {
				 return "success";
			}
			return "success";
			
		} else { // 修改
			EquWarehouse warehouse = (EquWarehouse) this.equipmentDAO.findById(
					EquWarehouse.class.getName(), uids);
			if(equid.equals(equWarehouse.getEquid())){
				warehouse.setEquid(equWarehouse.getEquid());
				warehouse.setEquno(equWarehouse.getEquno());
				warehouse.setParent(equWarehouse.getParent());
				warehouse.setDetailed(equWarehouse.getDetailed());
				warehouse.setMemo(equWarehouse.getMemo());
				warehouse.setUids(equWarehouse.getUids());
				this.equipmentDAO.saveOrUpdate(warehouse);
				return "success";
			}
			if ("1".equals(warehouse.getIsleaf().toString())) {
				//对没有字节点的父节点状态的改变
				String getEquidParent1 = "select parent from equ_warehouse " +
                                          "where equid='"+equid+"' and pid='"+warehouse.getPid()+"'";
				List getEquidData1 = JdbcUtil.query(getEquidParent1);
				Map mapEquid1 = (Map) getEquidData1.get(0);
				String getCheckEquid1 = mapEquid1.get("parent").toString();
				warehouse.setEquid(equWarehouse.getEquid());
				warehouse.setEquno(equWarehouse.getEquno());
				warehouse.setParent(equWarehouse.getParent());
				warehouse.setDetailed(equWarehouse.getDetailed());
				warehouse.setMemo(equWarehouse.getMemo());
				warehouse.setIsleaf(equWarehouse.getIsleaf());
				warehouse.setPid(equWarehouse.getPid());
				warehouse.setUids(equWarehouse.getUids());
				this.equipmentDAO.saveOrUpdate(warehouse);
				this.judgmentParent(uids,"updata",getCheckEquid1,warehouse.getPid());
				
			} else {
				//对有子节点的节点的父节点状态的改变
				String getEquidParent = "select parent from equ_warehouse where equid='"+equid+"' and pid='"+warehouse.getPid()+"'";
				List getEquidData = JdbcUtil.query(getEquidParent);
				Map map0 = (Map) getEquidData.get(0);
				String getCheckEquid = map0.get("parent").toString();
				warehouse.setEquid(equWarehouse.getEquid());
				warehouse.setParent(equWarehouse.getParent());
				this.equipmentDAO.saveOrUpdate(warehouse);
				String whereSql = "select * from equ_warehouse where parent='"
						+ equid + "' and pid='" + warehouse.getPid()
						+ "' order by equid";
				List list1 = JdbcUtil.query(whereSql);
				for (int i = 0; i < list1.size(); i++) {
					Map map1 = (Map) list1.get(i);
					EquWarehouse child2 = (EquWarehouse) this.equipmentDAO
							.findById(EquWarehouse.class.getName(), map1.get(
									"UIDS").toString());
					if ("1".equals(child2.getIsleaf().toString())) {
						String getNewEquid2 = getActequid(equWarehouse.getEquid(),
								child2.getPid(), 1);
						child2.setEquid(getNewEquid2);
						child2.setParent(equWarehouse.getEquid());

						this.equipmentDAO.saveOrUpdate(child2);
					} else if ("0".equals(child2.getIsleaf().toString())) {
						String getNewEquid = getActequid(equWarehouse.getEquid(),
								child2.getPid(), 1);
						String getNewEquid1 = getActequid(equWarehouse
								.getEquid(), child2.getPid(), 0);
						child2.setEquid(getNewEquid);
						child2.setParent(equWarehouse.getEquid());
						this.equipmentDAO.saveOrUpdate(child2);
						this.treeIteration(getNewEquid1, map1.get("EQUID")
								.toString(), child2.getPid());
					}

				}
				this.judgmentParent(uids,"updata",getCheckEquid,warehouse.getPid());
			}
			return "scuess";
		}

	}

	private void treeIteration(String getNewEquid1, String parent, String pid) {
		String whereSql = "select * from equ_warehouse where parent='" + parent + "' and pid='" + pid + "' order by equid";
		List list1 = JdbcUtil.query(whereSql);
		for (int i = 0; i < list1.size(); i++) {
			Map map1 = (Map) list1.get(i);
			String getuids = map1.get("UIDS").toString();
			EquWarehouse child2 = (EquWarehouse) this.equipmentDAO.findById(EquWarehouse.class.getName(), getuids);
			if ("1".equals(child2.getIsleaf().toString())) {
				String getNewEquid = getActequid(getNewEquid1, child2.getPid(), 1);
				child2.setEquid(getNewEquid);
				child2.setParent(getNewEquid1);
				this.equipmentDAO.saveOrUpdate(child2);
			} else {
				String getNewEquid2 = getActequid(getNewEquid1, child2.getPid(), 0);
				child2.setEquid(getNewEquid2);
				child2.setParent(getNewEquid1);
				this.equipmentDAO.saveOrUpdate(child2);
				this.treeIteration(getNewEquid2, map1.get("EQUID").toString(), child2.getPid());
			}
		}
	}

	/**
	 * 判断是个有子节点,修改父节点状态
	 */
	public void judgmentParent(String uids,String flag,String parent,String pid){
		//根据删除的节点查看父节点是否有子节点，有子节点不更新父节点的isleaf
		String  getIsleafSql = "select t.* from equ_warehouse t where t.parent='"
	                         +parent+"' and pid='"+pid+"' and equid<>'"+parent+"' order  by equid";
		List list1 = JdbcUtil.query(getIsleafSql);
		if(flag.equals("del") && list1.size()==1){
			this.equipmentDAO.updateBySQL("update equ_warehouse t set t.isleaf='1' where t.equid=(select parent from equ_warehouse where uids='"+uids+"' and pid='"+pid+"')");
		}else if(flag.equals("updata") && list1.size()==0){
			this.equipmentDAO.updateBySQL("update equ_warehouse t set t.isleaf='1' where t.equid='"+parent+"' and pid='"+pid+"'");
		}
	}

	public boolean isHasChilds1(String equid) {
		boolean flag = false;
		List list = this.equipmentDAO.findByProperty(beanName, "parent", equid);
		if (list.size() > 0) {
			flag = true;
		}
		return flag;
	}
	/**
	 * 获取设备仓库form上一级库区库位编码树及供货商分类树
	 * 
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		EquBaseInfoFacade equBaseInfoFacade = (EquBaseInfoFacade) Constant.wact.getBean("equBaseInfo");
		if (treeName.equalsIgnoreCase("sbckTree")) { // 设备供货商分类树
			Iterator it = params.entrySet().iterator();
			String pid = ((String[]) params.get("pid"))[0];
			while (it.hasNext()) {
				list = equBaseInfoFacade.getcsBmTree(parentId, pid);
				return list;
			}
		}
		if (treeName.equalsIgnoreCase("ckxxTree")) {// 设备仓库分类树
			String orgid = ((String[]) params.get("orgid"))[0];
			String parent = ((String[]) params.get("parent"))[0];
			String pid = ((String[]) params.get("pid"))[0];
			String isbody = params.get("isbody") != null ? ((String[]) params.get("isbody"))[0] : "";
			list = equBaseInfoFacade.ShowCKTree(parent, pid, orgid, isbody);
			return list;
		}
		if (treeName.equalsIgnoreCase("equBdgTree")) {
			String bdgidStr = ((String[]) params.get("bdgid"))[0];
			String parent = ((String[]) params.get("parent"))[0];
			list = this.equBdgTree(parent, bdgidStr);
			return list;
		}
		if(treeName.equalsIgnoreCase("equBdgTreeCode")){
			String bdgidStr = ((String[]) params.get("bdgid"))[0];
			String parent = ((String[]) params.get("parent"))[0];
			String codeName = ((String[])params.get("codeName"))[0];
			list = this.equBdgTreeOrPropertyCode(parent, bdgidStr,codeName);
			return list;
		}
		//主体材料出库，根据领料用途可选择其下的工程量
		if(treeName.equalsIgnoreCase("proacmTree")){
			String bdgidStr = ((String[]) params.get("bdgid"))[0];
			String parent = ((String[]) params.get("parentid"))[0];
			String relate = ((String[]) params.get("relate"))[0];
			list = this.bdgProacmTree(parent, bdgidStr, relate);
			return list;
		}
		return null;
	}

	/**
	 * 构建树结构
	 * 
	 * @param parentId
	 * @param pid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> getcsBmTree(String parentId, String pid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId : "root";
		List modules = JdbcUtil.query("select * from property_code t where t.type_name=" +
				"(select uids from property_type where type_name='设备专业分类')");
		Iterator itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			Map<String, String> map = (Map<String, String>) itr.next();
			PropertyCode temp = new PropertyCode();
			temp.setPropertyName(map.get("PROPERTY_NAME"));
			temp.setPropertyCode(map.get("PROPERTY_CODE"));
			temp.setModuleName(map.get("MODULE_NAME"));
			temp.setUids(map.get("UIDS"));
			temp.setTypeName(map.get("TYPE_NAME"));
			int leaf = 1;
			n.setId(map.get("PROPERTY_CODE")); // treenode.id
			n.setText(map.get("PROPERTY_NAME")); // treenode.text
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("icon-pkg"); // treenode.cls
			}
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;
	}

	/**
	 * 展现树结构
	 * 
	 * @param parentId
	 * @param pid
	 * @param orgid
	 * @param isbody 是否主体设备材料 0 否 1 是
	 * @return
	 */
	public List<ColumnTreeNode> ShowCKTree(String parentId, String pid,
			String orgid, String isbody) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: "0";
		String where = "pid='" + pid + "' and parent = '" + parent + "' and equid<>'"+orgid+"'";
		// 1 主体设备材料
		where += "1".equals(isbody) ? " and waretype is not null" : " and waretype is null";
		List modules =this.equipmentDAO.findByWhere(EquWarehouse.class.getName(), where, "equid");
		Iterator itr = modules.iterator();
		try {
			while (itr.hasNext()) {
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode n = new TreeNode();
				EquWarehouse temp = (EquWarehouse) itr.next();
				int leaf = Integer.parseInt(temp.getIsleaf().toString());
				n.setId(temp.getEquid().toString()); // treenode.id
				String text = "1".equals(isbody) ?
						(temp.getWareno() != null ? temp.getWareno().toString() : "")
						: temp.getDetailed().toString();
				n.setText(text); // treenode.text
				if (leaf == 1) {
					n.setLeaf(true);
					n.setIconCls("icon-cmp");
				} else {
					n.setLeaf(false); // treenode.leaf
					n.setCls("icon-pkg"); // treenode.cls
				}
				cn.setTreenode(n); // ColumnTreeNode.treenode
				JSONObject jo = JSONObject.fromObject(temp);
				cn.setColumns(jo); // columns
				list.add(cn);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	/**
	 * 仓库设备form下拉框自动获取系统编码
	 * @param equid
	 * @param pid
	 * @return
	 */
	public String getActequid(String equid, String pid, int index) {
		String newEquid = "";
		String whereSql = " select max(t.equid) as equid from equ_warehouse t where t.parent='"
					+ equid + "' and t.pid='" + pid + "'";
		
		List list = JdbcUtil.query(whereSql);
		Map<String, String> map = (Map<String, String>) list.get(0);
		String getEquid = map.get("EQUID");
		if (getEquid == null) {
				newEquid = equid + "01";
		} else {
			int intEuqid = 0;
			int x= getEquid.length();
			if (getEquid.length() > 2) {
				String str1 = equid;
				String str2 = getEquid.substring(equid.length());
				intEuqid = Integer.parseInt(str2);
				if (index == 1) {
					if (intEuqid >= 9) {
						newEquid = str1 + String.valueOf(intEuqid + 1);
					} else {
						newEquid = str1 + "0" + String.valueOf(intEuqid + 1);
					}
					
				} else {
					if (intEuqid >= 9) {
						newEquid = str1 + String.valueOf(intEuqid + 1);
					} else {
						newEquid = str1 + "0" + String.valueOf(intEuqid + 1);
					}
				}
			} else {
				intEuqid = Integer.parseInt(getEquid);
				if(intEuqid>=9){
					newEquid = String.valueOf(intEuqid+1);
				}else{
					intEuqid +=1;
					newEquid = "0"+String.valueOf(intEuqid);
				}
				
			}
		}
		return newEquid;
	}

	/**
	 * 检查供应商编码的唯一性 
	 */
	public boolean checkCSno(String csdm){
		List list = this.equipmentDAO.findByProperty("com.sgepit.pmis.equipment.hbm.SbCsb", "csdm", csdm);
		if(list.size()>0) return false;
		return true;
	}

	/**
	 * 关于供应商信息添加修改
	 */
	public String addOrUpdateEquCsb(SbCsb sbcsb) {
		String flag = "0";
		try{
			if("".equals(sbcsb.getUids())||sbcsb.getUids()==null){//新增
				sbcsb.setIsused("1");//默认为启用
				this.equipmentDAO.insert(sbcsb);
				flag="1";
			}else{//修改
				//更新物资编码表
				this.equipmentDAO.saveOrUpdate(sbcsb);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}

	/**
	 * 供应商启用或禁用
	 */
	public boolean updateEquCsStateChange(String uids,String flag) {
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String [] uidsArr = uids.split(",");
		for(int i=0 ; i< uidsArr.length; i++){
			jdbc.update(" update sb_csb set isused='"+flag+"' where uids='"+uidsArr[i]+"' ");
		}
		return true;		
	}

    /**
     * 重新构建设备合同分类树
     * @param parentId
     * @param whereStr
     * @param conid
     * @return
     */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> newEquTypeTreeList(String parentId, String whereStr, String conid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String [] parentIf = parentId.split("`");
		String treeIdIf="";
		if(parentIf.length>1){
			treeIdIf=parentIf[1];
		}
		parentId=parentIf[0];
//		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		StringBuffer str = new StringBuffer();
		
		if(parentId!=null &&!"".equals(parentId)){
			str.append(" parentid='"+parentId+"'");
		}else {
			str.append("start with  parentid='0'");
		}
		if(conid!=null &&!"".equals(conid)){
			str.append(" and conid='" + conid + "'");
		}
		if(treeIdIf !=null &&!"".equals(treeIdIf)){
			str.append(" and treeid not in ('" + treeIdIf + "')");
		}
		//当父节点不为'0'时按pid过滤
		if(!"0".equals(parentId)){
			str.append(" and pid='"+whereStr+"'");
		}
		//如果不是燃气项目，也不是国峰项目，则设备合同树不显示材料合同和施工合同（加入国金项目的PID）
		if(!"".equals(whereStr) && !"1031902".equals(whereStr) && !"1032102".equals(whereStr) 
				&& !"1030902".equals(whereStr) && !"1030903".equals(whereStr) ){
			List<Map<String,String>> clUid = JdbcUtil.query("select c.uids from PROPERTY_CODE c where c.TYPE_NAME in " +
					"(select t.UIDS from PROPERTY_TYPE t where t.type_name = '材料合同' or t.type_name = '施工合同')");
			if( null!=clUid && clUid.size()>0){
				str.append(" and uids not in (");
				for(int i=0;i<clUid.size();i++){
					Map<String,String> cluids = clUid.get(i);
					str.append("'"+cluids.get("UIDS")+"',");
				}
				str = str.replace(str.length()-1, str.length(),")");
			}
		}
//		"select *from equ_con_ove_tree_view start with  parentid='006' connect by prior  treeid = parentid  and conid =''"
		//str.append(" order by treeid asc");
		List<EquConOveTreeView> list1 = this.equipmentDAO.findByWhere(EquConOveTreeView.class.getName(),str.toString(),"treeid asc");
		//JdbcUtil.query(sql);
		
		//List<EquListQc> objects = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat("EquListQc"), str);
		//Iterator<EquListQc> itr = objects.iterator();
		for(int i=0;i<list1.size();i++){
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			EquConOveTreeView ecotv = (EquConOveTreeView) list1.get(i);
			Long leaf = ecotv.getIsleaf();			
			//n.setId(ecotv.getTreeid());
			n.setId((ecotv.getConid() == null ?"sort":ecotv.getConid()) + "-" + ecotv.getTreeid());// 设置不同的tree id
			n.setText(ecotv.getName());
			
			//n.setId(temp.getSbid());			// treenode.id
			//n.setText(temp.getSbMc());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(ecotv);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

	/**
	 * 删除包装方式--已经使用的包装方式不能删除
	 * @param ids
	 * @return
	 */
	public int deletePackStyleById(String [] ids) {
		int flag = 0;
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquPackStyle");
		String beanNameList = BusinessConstants.EQU_PACKAGE.concat("EquGoodsArrivalSub");
		for (int i = 0; i < ids.length; i++) {
			EquPackStyle eps = (EquPackStyle)this.equipmentDAO .findById(beanName, ids[i]);
			//被使用过的包装方式不能删除
			List listList = this.equipmentDAO.findByWhere(beanNameList, "packType = '"+eps.getPuuid()+"'");
			if(listList.size()>0){
				flag = 1;
				break;
			}
			//删除设备
			this.equipmentDAO.delete(eps);
		}
		return flag;
	}

	/**
	 * 从属性列表中获取设备合同树分类的属性值：1-主要设备；2-备品备件；3-专用工具；4-技术资料
	 * @return
	 */
	public List<Map<String, String>> getTreeTypesb(){
		String treesql="select c.property_code,c.property_name from property_code c " +
		"where c.type_name = (select t.uids from property_type t where t.type_name = '设备合同树分类') order by c.property_code";
		List<Map<String, String>> ltree = JdbcUtil.query(treesql);
		return ltree;
	}

	/**
	 * 初始化设备合同分类树
	 */
	public void initEquTypeTree(String initFlag){
		
		 //取得所有设备合同
		String sbSql = "select c.property_code from property_code c " +
		"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
		"and c.detail_type like '%SB%'";
		//燃气项目设备合同分类树增加材料合同和施工合同
		if(initFlag.equals("2") || initFlag.equals("3")){
			sbSql += " or c.detail_type like '%CL%' or c.detail_type like '%GC%'";
		}
		//国峰项目设备合同分类树增加材料合同
		if(initFlag.equals("4") || initFlag.equals("5")){
			sbSql += " or c.detail_type like '%CL%'";
		}
		String condivo="";
		List<Map<String, String>> l = JdbcUtil.query(sbSql);
		Iterator it = l.iterator();
		while (it.hasNext()){
			Map<String, String> map = (Map<String, String>) it.next();
			condivo = map.get("PROPERTY_CODE");
			List cons=equipmentDAO.findByWhere("com.sgepit.pmis.contract.hbm.ConOve", "condivno='"+condivo+"'");
			Iterator itcon = cons.iterator();
			//一次对设备合同初始化
			while (itcon.hasNext()){
				ConOve con = (ConOve)itcon.next();
				String conNo = con.getConno();
				String conid=con.getConid();
				List  list = this.equipmentDAO.findByWhere("com.sgepit.pmis.equipment.hbm.EquTypeTree", "parentid='0' and conid='"+conid+"'");
				if (list.size()>0) {// 判断合同是否存在,只初始化equ_type_tree表中不存在的合同
					EquTypeTree etemp=(EquTypeTree) list.get(0);
					String etempTreeid=etemp.getTreeid();
					if(!conNo.equals(etempTreeid)){//判断合同编号是否修改过，修改过则更新equ_type_tree表对应的合同信息
						etemp.setTreeid(conNo);
						this.equipmentDAO.saveOrUpdate(etemp);
						List  listChildren = this.equipmentDAO.findByWhere("com.sgepit.pmis.equipment.hbm.EquTypeTree", "parentid='"+etempTreeid+"' and conid='"+conid+"'");
						Iterator<EquTypeTree> itchild=listChildren.iterator();
						while(itchild.hasNext()){
							EquTypeTree ettchild=itchild.next();
							ettchild.setParentid(conNo);
							this.equipmentDAO.saveOrUpdate(ettchild);
						}
					}
					if("1".equals(initFlag)||"3".endsWith(initFlag)||"5".endsWith(initFlag)){
						List  list2 = this.equipmentDAO.findByWhere("com.sgepit.pmis.equipment.hbm.EquTypeTree", "parentid='"+conNo+"' and conid='"+conid+"'");
						if(list2.size()<1){
							//初始化设备合同的同时同时增加主 设备、备品备件、专用工具、技术资料
							List<Map<String, String>> ltree=this.getTreeTypesb();
							Iterator its = ltree.iterator();
							int flagtree=1;
							while (its.hasNext()){
								Map<String, String> map1 = (Map<String, String>) its.next();
								EquTypeTree con_equ = new EquTypeTree();
								if(flagtree<10){//设置设备合同分类树编号
									con_equ.setTreeid("0"+flagtree);
								}else{
									con_equ.setTreeid(""+flagtree);
								}
								con_equ.setConid(conid);
								con_equ.setTreename(map1.get("PROPERTY_CODE"));
								con_equ.setParentid(conNo);
								con_equ.setIsleaf(new Long(1));
								con_equ.setPid(con.getPid());
								this.equipmentDAO.saveOrUpdate(con_equ);
								++flagtree;
							}
						}
					}
					continue;
				}
				EquTypeTree equList = new EquTypeTree();
				equList.setPid(con.getPid());
				equList.setConid(conid);
				equList.setTreeid(con.getConno());
				equList.setTreename("");
				equList.setParentid("0");
				equList.setIsleaf(new Long(0));
				this.equipmentDAO.saveOrUpdate(equList);
			}
		}
	}

	/**
	 * 使用ColumnTree组件构造设备合同分类树
	 * @param parentId
	 * @param whereStr
	 * @return
	 */
	public List<ColumnTreeNode> equTypeTree(String parentId, String whereStr,String conid,String initFlag)  {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquTypeTree");
		if(parentId.equals("0")){//每次刷新页面时，初始化
			initEquTypeTree(initFlag);
		}
		List pls=this.equipmentDAO.findByWhere(beanName, "treeid='"+parentId+"' and conid='"+conid+"'");
		if(pls.size()>0){
			EquTypeTree equTypeTreeParent =(EquTypeTree) pls.get(0);
			if(equTypeTreeParent.getParentid().equals("0")){//每次刷新页面时，初始化
				initEquTypeTree(initFlag);
			}
		}
		if(conid!=null &&!"".equals(conid)){
			whereStr+=" and conid='" + conid + "'";
		}
		String str = "parentid='"+ parent +"'" + whereStr + " order by treeid ";
		List<EquTypeTree> objects = this.equipmentDAO.findByWhere2(beanName, str);
		Iterator<EquTypeTree> itr = objects.iterator();
		while (itr.hasNext()) {//构造设备合同分类树
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			EquTypeTree temp = (EquTypeTree) itr.next();
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getConid()+"-"+temp.getTreeid());//设置不同的tree id	
			ConOve conOve = (ConOve) this.equipmentDAO.findById("com.sgepit.pmis.contract.hbm.ConOve", temp.getConid());
			if(conOve==null) continue;
			//设置树节点显示名称
			if(temp.getParentid().equals("0")){//设备合同作为根节点时，名称显示：合同编号[合同名称]
				n.setText(conOve.getConno()+"【"+conOve.getConname()+"】");
			}else if("1".equals(initFlag) || "3".endsWith(initFlag) || "5".endsWith(initFlag)){
				String pre="^[0-9][1-9]$";
				String tempTreeid=temp.getTreeid();
				if(tempTreeid.matches(pre)){
					List<Map<String, String>> ltree=this.getTreeTypesb();
					Iterator its = ltree.iterator();
					while (its.hasNext()){//合同主要属性显示期属性名称，而不是codeid(数据库存PROPERTY_CODE，页面显示PROPERTY_NAME)
						Map<String, String> map = (Map<String, String>) its.next();
						String property_code=map.get("PROPERTY_CODE");
						String property_name=map.get("PROPERTY_NAME");
						if(temp.getTreename().equals(property_code)){
							n.setText(property_name);
						}
					}
				}else{//除设备合同根节点和主属性节点以外的其他节点直接显示treename
					n.setText(temp.getTreename());		// treenode.text
				}
			}
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

	/**
	 * 使用ColumnTree组件构造设备合同分类树（用于除设备合同分类树维护页面以外的页面）
	 * @param parentId
	 * @param whereStr
	 * @return
	 */
	public List<ColumnTreeNode> equTypeTreeList(String parentId, String whereStr,String conid)  {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String [] parentIf=parentId.split("`");
		String treeIdIf="";
		if(parentIf.length>1){
			treeIdIf=parentIf[1];
		}
		parentId=parentIf[0];
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquTypeTree");
		if(conid!=null &&!"".equals(conid)){
			whereStr+=" and conid='" + conid + "'";
		}
		if(treeIdIf!=null &&!"".equals(treeIdIf)){
			whereStr+=" and treeid not in ('" + treeIdIf + "')";
		}
		String str = "parentid='"+ parent +"'" + whereStr + " order by treeid ";
		List<EquTypeTree> objects = this.equipmentDAO.findByWhere2(beanName, str);
		Iterator<EquTypeTree> itr = objects.iterator();
		while (itr.hasNext()) {//构造设备合同分类树
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			EquTypeTree temp = (EquTypeTree) itr.next();
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getConid()+"-"+temp.getTreeid());//设置不同的tree id	
			ConOve conOve = (ConOve) this.equipmentDAO.findById("com.sgepit.pmis.contract.hbm.ConOve", temp.getConid());
			if(conOve==null) continue;
			//设置树节点显示名称
			if(temp.getParentid().equals("0")){//设备合同作为根节点时，名称显示：合同编号[合同名称]
				n.setText(conOve.getConno()+"【"+conOve.getConname()+"】");
			}else{
				String pre="^[0-9][1-9]$";
				String tempTreeid=temp.getTreeid();
				if(tempTreeid.matches(pre)){
					List<Map<String, String>> ltree=this.getTreeTypesb();
					Iterator<Map<String, String>> its = ltree.iterator();
					while (its.hasNext()){//合同主要属性显示期属性名称，而不是codeid(数据库存PROPERTY_CODE，页面显示PROPERTY_NAME)
						Map<String, String> map = its.next();
						String property_code=map.get("PROPERTY_CODE");
						String property_name=map.get("PROPERTY_NAME");
						if(temp.getTreename().equals(property_code)){
							n.setText(property_name);
						}
					}
				}else{//除设备合同根节点和主属性节点以外的其他节点直接显示treename
					n.setText(temp.getTreename());		// treenode.text
				}
			}
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

	/**
	 * 使用treegrid组件构造设备合同分类树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 */
	public List<ColumnTreeNode> buildEquTypeTree(String orderBy,
			Integer start, Integer limit, HashMap map) {
		List<EquTypeTree> list = new ArrayList();
		       //页面定义处的参数
		String  parent=(String)map.get("parent");
		       //页面定义处的参数
		String pid=(String)map.get("pid");
		       
		String conid=(String)map.get("conid");
		//拼装一般查询语句
	    list =this.equipmentDAO.findByWhere(EquTypeTree.class.getName(), " parentid='"+parent+"' and pid='"+pid+"' and conid='"+conid+"'","treeid");
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
	 * 判断根节点有没有子节点
	 */
	public boolean isHasChilds(String uuid){
		boolean flag = false;
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquTypeTree");
		EquTypeTree equTypeTree = (EquTypeTree)this.equipmentDAO.findById(beanName, uuid);
		List list =  this.equipmentDAO.findByWhere(beanName, "parentid='"+equTypeTree.getTreeid()+"' and conid='"+equTypeTree.getConid()+"'");
		if (list.size() > 0){
			flag = true;
		}
		return flag;
	}

	/**
	 * 删除选中的节点以及其所有子节点
	 */
	public int deleteChildNodes(String uuid){
		int flag = 0;  // 删除返回标志: 0为成功，1为失败
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquTypeTree");
		String beanNamea = BusinessConstants.EQU_PACKAGE.concat("EquGoodsArrival");
		String beanNamef = BusinessConstants.EQU_PACKAGE.concat("EquFile");
		EquTypeTree equTypeTree = (EquTypeTree)this.equipmentDAO.findById(beanName, uuid);
		String pid= equTypeTree==null ? "" :equTypeTree.getPid();
		String parentId = equTypeTree==null ? "" : equTypeTree.getParentid();
		
		String whereSql = "select distinct t.uuid from equ_type_tree t where t.conid='"+equTypeTree.getConid()+"' connect by prior  t.treeid = t.parentid " 
	           +" start with t.treeid='"+equTypeTree.getTreeid()+"'" ;	//找到子节点	
		List listP = (List)this.equipmentDAO.findByWhere(beanName, "parentid='"+parentId+"' and conid='"+equTypeTree.getConid()+"'");
		
		List list=JdbcUtil.query(whereSql);
		
		for(int i=0;i<list.size();i++){//如果节点或其子节点有到货信息，则不能删除
			Map m=(Map) list.get(i);
			Object o=m.get("uuid");
			String uuidTemp=o.toString();
			EquTypeTree equTemp=(EquTypeTree) this.equipmentDAO.findById(beanName, uuidTemp);
			String treeidTemp=equTemp.getTreeid().substring(0, 2);
			if(treeidTemp.equals("04")){//删除技术资料属性下的节点时，如果该节点或其子节点下有资料信息，则不能删除
				List fileList=this.equipmentDAO.findByProperty(beanNamef, "treeuids", uuidTemp);
				if(fileList.size()>0){
					flag=3;
					return flag;
				}
			}else{
				//删除除技术资料属性下的节点时(设备到货主表，设备开箱通知单主表，设备开箱主表，
				//设备开箱明细表，设备开箱部件表，设备入库主表，设备出库主表，设备退库主表)，
				//如果该节点或其子节点下有设备数据，则不能删除
				String isDelSql="select treeuids from equ_goods_arrival where treeuids='"+uuidTemp+"' and pid='"+pid+"' union "+
				"select treeuids from EQU_GOODS_OPENBOX_NOTICE where treeuids='"+uuidTemp+"' and pid='"+pid+"' union "+
				"select treeuids from EQU_GOODS_OPENBOX where treeuids='"+uuidTemp+"' and pid='"+pid+"' union "+
				"select treeuids from EQU_GOODS_OPENBOX_SUB where treeuids='"+uuidTemp+"' and pid='"+pid+"' union "+
				"select treeuids from EQU_GOODS_OPENBOX_SUB_PART where treeuids='"+uuidTemp+"' and pid='"+pid+"' union "+
				"select treeuids from EQU_GOODS_STOREIN where treeuids='"+uuidTemp+"' and pid='"+pid+"' union "+
				"select treeuids from EQU_GOODS_STOCK_OUT where treeuids='"+uuidTemp+"' and pid='"+pid+"' union "+
				"select treeuids from EQU_GOODS_STORE_TK where treeuids='"+uuidTemp+"' and pid='"+pid+"'";
				List isDelList=JdbcUtil.query(isDelSql);
				if(isDelList.size()>0){
					flag=2;
					return flag;
				}
			}
		}
		for(int i=0;i<list.size();i++){
			Map m=(Map) list.get(i);
			Object o=m.get("uuid");
			String uuidTemp=o.toString();
			
			EquTypeTree equTypeTreeTemp = (EquTypeTree)this.equipmentDAO.findById(beanName, uuidTemp);
			this.equipmentDAO.delete(equTypeTreeTemp);
		}
		
		try {
			if (listP.size() == 1){
				EquTypeTree equTypeTreeParent =(EquTypeTree) this.equipmentDAO.findByWhere(beanName, "treeid='"+parentId+"' and conid='"+equTypeTree.getConid()+"'").get(0);
				equTypeTreeParent.setIsleaf(new Long(1));
				this.equipmentDAO.saveOrUpdate(equTypeTreeParent);
			}
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}

	/**
	 * 新增或修改设备合同分类
	 */
	public int addOrUpdate(EquTypeTree equTypeTree,String oldParent){
		int flag = 0;
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquTypeTree");
		
		String where =" pid='"+equTypeTree.getPid()+"' and treeid='"+equTypeTree.getTreeid()+"' and conid='"+equTypeTree.getConid()+"'";
		if(!"".equals(equTypeTree.getUuid())){
			where+=" and uuid !='"+equTypeTree.getUuid()+"'";
		}
		List listEEquTypeTree=equipmentDAO.findByWhere(beanName, where);
		if(listEEquTypeTree.isEmpty()){
			try {
				 if ("".equals(equTypeTree.getUuid())){   //  新增
					List list = (List)this.equipmentDAO.findByWhere(beanName, "parentid='"+equTypeTree.getParentid()+"' and conid='"+equTypeTree.getConid()+"'");
					if (list.isEmpty()){
						EquTypeTree parentBequ = (EquTypeTree)this.equipmentDAO.findByWhere(beanName, "treeid='"+equTypeTree.getParentid()+"' and conid='"+equTypeTree.getConid()+"'").get(0);
						parentBequ.setIsleaf(new Long(0));
						this.equipmentDAO.saveOrUpdate(parentBequ);
					}
					this.equipmentDAO.insert(equTypeTree);
				}else{//修改
					String parentide=equTypeTree.getParentid();
					if(!oldParent.equals(parentide)){//是否升级或降级
						List brotherlist =  this.equipmentDAO.findByWhere(beanName, "parentid='"+oldParent+"' and conid='"+equTypeTree.getConid()+"' and treeid <> '"+equTypeTree.getTreeid()+"'");
						if (brotherlist.size() ==0){//如果老父节点没有子节点，则设置老父节点为叶子节点
							EquTypeTree oldparent = (EquTypeTree)this.equipmentDAO.findByWhere(beanName, "treeid='"+oldParent+"' and conid='"+equTypeTree.getConid()+"'").get(0);
							oldparent.setIsleaf(new Long(1));
							this.equipmentDAO.saveOrUpdate(oldparent);
						}
						List newbrotherlist =  this.equipmentDAO.findByWhere(beanName, "parentid='"+parentide+"' and conid='"+equTypeTree.getConid()+"'");
						String maxtreeid="";
						String newtreeid="";
						if (newbrotherlist.size() <1){//新父节点是否有子节点，如果没有，则设置新父节点为根节点
							EquTypeTree newparent = (EquTypeTree)this.equipmentDAO.findByWhere(beanName, "treeid='"+equTypeTree.getParentid()+"' and conid='"+equTypeTree.getConid()+"'").get(0);
							newparent.setIsleaf(new Long(0));
							newtreeid=newparent.getTreeid()+"01";
							this.equipmentDAO.saveOrUpdate(newparent);
						}else{//新父节点有子节点,则找出其子节点的最大treeid，并自动加一后作为当前节点的新treeid
							String sqltree="select max(t.treeid) treeid from equ_type_tree t where parentid='"+parentide+"' and conid='"+equTypeTree.getConid()+"'";
							List<Map<String, String>> l = JdbcUtil.query(sqltree);
							Iterator it = l.iterator();
							while (it.hasNext()){
								Map<String, String> map = (Map<String, String>) it.next();
								maxtreeid = map.get("TREEID");
							}
							newtreeid=this.stringAddOne(maxtreeid);
						}
						String oldtreeid=equTypeTree.getTreeid();
						//同时修改子节点的treeid和parentid
						this.changeChildren(newtreeid, oldtreeid, equTypeTree.getConid());
						equTypeTree.setTreeid(newtreeid);
						this.equipmentDAO.saveOrUpdate(equTypeTree);
					}else{//正常的修改操作
						this.equipmentDAO.saveOrUpdate(equTypeTree);
					}
				}
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
	 * 升级或降级后修改根节点下所有子节点的treeid和parentid
	 * @param newtreeidtemp
	 * @param oldtreeid
	 * @param conid
	 */
	public void changeChildren(String newtreeidtemp,String oldtreeid,String conid){
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquTypeTree");
		List list = (List)this.equipmentDAO.findByWhere(beanName, "parentid='"+oldtreeid+"' and conid='"+conid+"'");
		Iterator<EquTypeTree> its=list.iterator();
		while(its.hasNext()){
			EquTypeTree eTT=its.next();
			String oldchildtreeid=eTT.getTreeid();
			if(eTT.getIsleaf()==0){//如过节点还有子节点，则递归查找其子节点
				String newchildtreeid=newtreeidtemp+oldchildtreeid.substring(oldchildtreeid.length()-2);
				String newchildparentid=newtreeidtemp;
				eTT.setTreeid(newchildtreeid);
				eTT.setParentid(newchildparentid);
				this.equipmentDAO.saveOrUpdate(eTT);
				this.changeChildren(newchildtreeid, oldchildtreeid, conid);
			}else{
				String newchildtreeid=newtreeidtemp+oldchildtreeid.substring(oldchildtreeid.length()-2);
				String newchildparentid=newtreeidtemp;
				eTT.setTreeid(newchildtreeid);
				eTT.setParentid(newchildparentid);
				this.equipmentDAO.saveOrUpdate(eTT);
			}
		}
		
	}
	//同过当前节点的treeid和conid，获取其父节点的treeid和treename
	public Map getEquTypeTreeByProperties(String parent,String conid){
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquTypeTree");
		EquTypeTree parentBequ = (EquTypeTree)this.equipmentDAO.findByWhere(beanName, "treeid='"+parent+"' and conid='"+conid+"'").get(0);
		Map map=new HashMap();
		map.put("treeid", parentBequ.getTreeid());
		map.put("treename", parentBequ.getTreename());
		return map;
	}
	//同过当前节点的conid和“0”，获取当前设备合同的根节点节点的treeid和treename
	public Map getEquTypeTreeRootByProperties(String parent,String conid){
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquTypeTree");
		EquTypeTree parentBequ = (EquTypeTree)this.equipmentDAO.findByWhere(beanName, "parentid='"+parent+"' and conid='"+conid+"'").get(0);
		Map map=new HashMap();
		map.put("treeid", parentBequ.getTreeid());
		map.put("treename", parentBequ.getTreename());
		return map;
	}

	/**
	 * 字符串自动加一(适合加一后进一位或不进位，排除同时进位的情况)
	 * @param str
	 * @return
	 */
	public String stringAddOne(String str){
		char [] ch=str.toCharArray();
		String newstr="";
		char lastchar=ch[ch.length-1];
		if(lastchar !='9'){
			ch[ch.length-1]=(char)(lastchar+1);
			newstr=String.valueOf(ch);
			return newstr;
		}else{
			ch[ch.length-1]='0';
			ch[ch.length-2]=(char)(ch[ch.length-2]+1);
			newstr=String.valueOf(ch);
			return newstr;
		}
	}

	//zhangh
    /**
     * 重新构建设备合同分类树
     * @param parentId
     * @param whereStr
     * @param conid
     * @return
     */
	public List<ColumnTreeNode> newEquTypeTreeListSingle(String parentId, String whereStr, String conid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String [] parentIf=parentId.split("`");
		String treeIdIf="";
		if(parentIf.length>1){
			treeIdIf=parentIf[1];
		}
		parentId=parentIf[0];
//		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		StringBuffer str= new StringBuffer();
		
		if(parentId!=null &&!"".equals(parentId)){
			str.append(" parentid='"+parentId+"'");
		}else {
			str.append(" start with  parentid='0'");
		}
		if(conid!=null &&!"".equals(conid)){
			str.append(" and conid='" + conid + "'");
		}
		if(treeIdIf !=null &&!"".equals(treeIdIf)){
			str.append(" and treeid not in ('01','04')");
		}
		str.append(" and treeid not in ('01','04')");
		//如果不是燃气项目，也不是国峰项目，则设备合同树不显示材料合同（加入国金项目的PID）
		if(!"".equals(whereStr) && !"1031902".equals(whereStr) && !"1032102".equals(whereStr) 
				&& !"1030902".equals(whereStr) && !"1030903".equals(whereStr) ){
			List<Map<String,String>> clUid = JdbcUtil.query("select c.uids from PROPERTY_CODE c where c.TYPE_NAME in" +
					" (select t.UIDS from PROPERTY_TYPE t where t.type_name = '材料合同' or t.type_name = '施工合同')");
			if( null!=clUid && clUid.size()>0){
				str.append(" and uids not in (");
				for(int i=0;i<clUid.size();i++){
					Map<String,String> cluids = clUid.get(i);
					str.append("'"+cluids.get("UIDS")+"',");
				}
				str = str.replace(str.length()-1, str.length(),")");
			}
		}
//		"select *from equ_con_ove_tree_view start with  parentid='006' connect by prior  treeid = parentid  and conid =''"
		str.append(" order by treeid asc");
		List<EquConOveTreeView> list1 = this.equipmentDAO.findByWhere(EquConOveTreeView.class.getName(),str.toString(),"treeid asc");
		//JdbcUtil.query(sql);
		
		//List<EquListQc> objects = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat("EquListQc"), str);
		//Iterator<EquListQc> itr = objects.iterator();
		for(int i=0;i<list1.size();i++){
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			EquConOveTreeView ecotv = (EquConOveTreeView) list1.get(i);
			Long leaf = ecotv.getIsleaf();			
			//n.setId(ecotv.getTreeid());
			n.setId((ecotv.getConid() == null ?"sort":ecotv.getConid()) + "-" + ecotv.getTreeid());// 设置不同的tree id
			n.setText(ecotv.getName());
			
			//n.setId(temp.getSbid());			// treenode.id
			//n.setText(temp.getSbMc());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(ecotv);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

//以下是移植津能主体设备维护相关方法
	/**
	 * 设备主体设备出入库保存或修改
	 * 
	 * @param equGoodsBodys
	 * @return
	 */
	public String equBodySaveOrUpdate(EquGoodsBodys equGoodsBodys) {
		String uids = equGoodsBodys.getUids();
		if (uids.equals("")) {// 新增
			this.equipmentDAO.insert(equGoodsBodys);
		} else {// 修改
			this.equipmentDAO.saveOrUpdate(equGoodsBodys);
		}
		return "success";
	}

	/**
	 * 构建通用的仓库树
	 * 
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @author zhangh 2012-09-21
	 * @throws BusinessException
	 */
	public List<TreeNode> buildTree(String treeName, String parentId, Map params)
			throws BusinessException {
		List<TreeNode> list = new ArrayList<TreeNode>();
		// 设备仓库分类数树新 zhangh
		if (treeName.equalsIgnoreCase("ckxxTreeNew")) {
			String parent = ((String[]) params.get("parent"))[0];
			String conid = null != params.get("conid") ? ((String[]) params.get("conid"))[0] : "";
			list = this.ShowCKTreeNew(parent, conid);
			return list;
		}
		if(treeName.equalsIgnoreCase("ckxxTreeNewQuery")){
			String parent = ((String[]) params.get("parent"))[0];
			list = this.ckxxTreeNewQuery(parent);
			return list;			
		}
		return null;
	}

	/**
	 * 设备仓库分类树
	 * 
	 * @param parentId
	 * @param conid 出入库单对应的合同
	 * @return
	 * @author zhangh 2012-09-21
	 */
	public List<TreeNode> ShowCKTreeNew(String parentId, String conid) {
		List<TreeNode> list = new ArrayList<TreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId : "0";
		String where = "parent='" + parentId;
		String condivno = "";
		//限制材料合同只能选材料仓库，设备合同只能选设备仓库，施工合同不限制 pengy 2015-03-09
		if (conid != null && !"".equals(conid)){
			List<String> condivnos = this.equipmentDAO.getDataAutoCloseSes(
					"select c.condivno from con_ove c where c.conid='" + conid + "'");
			condivno = condivnos != null && condivnos.size()>0 ? condivnos.get(0) : "";
		}
		String where2 = "' and waretype" + (!"".equals(condivno) && !"SG".equals(condivno)
				? "='" + condivno + "'" : " is not null");
		List modules = this.equipmentDAO.findByWhere(EquWarehouse.class
				.getName(), where + where2, "equid");
		Iterator itr = modules.iterator();
		String treeJsonStr = "";
		try {
			while (itr.hasNext()) {
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode n = new TreeNode();
				EquWarehouse temp = (EquWarehouse) itr.next();
				int leaf = Integer.parseInt(temp.getIsleaf().toString());
				n.setId(temp.getEquid().toString()); // treenode.id
				n.setText(temp.getWareno() != null ? temp.getWareno().toString() : ""); // treenode.text
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
	 * 构建概算选择树
	 * @param parentId
	 * @param bdgidStr
	 * @return
	 */
	public List<ColumnTreeNode> equBdgTree(String parentId, String bdgidStr) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String where = " parent = '" + parentId + "'";
		if (parentId.equals("01")) {
			String inStr = StringUtil.transStrToIn(bdgidStr, ",");
			where += " and bdgid in (" + inStr + ")";
		}
		List<BdgInfo> objects = this.equipmentDAO.findByWhere(BdgInfo.class
				.getName(), where, "bdgid");
         
		Iterator<BdgInfo> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgInfo temp1 = (BdgInfo) itr.next();
			BdgInfo temp = new BdgInfo();
			try {
				BeanUtils.copyProperties(temp, temp1);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getBdgid()); // treenode.id
			n.setText(temp.getBdgname()); // treenode.text

			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("task");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("master-task"); // treenode.cls
				n.setIconCls("task-folder"); // treenode.iconCls
			}
			n.setIfcheck("none");
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;
	}
	
	/**
	 * 构建仓库树结构用于高级查询
	 * @param parentId
	 * @return
	 * @author yanglh 2013-10-29
	 */
	private List<TreeNode> ckxxTreeNewQuery(String parentId) {
		List<TreeNode> list = new ArrayList<TreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId : "0";
		String where = " parent = '" + parentId + "' ";
		List modules = this.equipmentDAO.findByWhere(EquWarehouse.class.getName(), where, "equid");
		Iterator itr = modules.iterator();
		String treeJsonStr = "";
		try {
			while (itr.hasNext()) {
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode n = new TreeNode();
				EquWarehouse temp = (EquWarehouse) itr.next();
				int leaf = Integer.parseInt(temp.getIsleaf().toString());
				n.setId(temp.getUids().toString()); // treenode.id
//				n.setId(temp.getEquid().toString()); // treenode.id
				n.setText(temp.getEquno().toString()); // treenode.text
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

	// zhangh
	/**
	 * 设备仓库新保存方法
	 * 
	 * @param equWarehouse
	 * @return
	 * @author zhangh 2012-09-20
	 */
	public String addOrUpdateEquWarehouseNew(EquWarehouse equWarehouse) {
		String uids = equWarehouse.getUids();
		if (uids == null || uids.equals("")) {
			this.equipmentDAO.insert(equWarehouse);
			List list = this.equipmentDAO.findByWhere(EquWarehouse.class
					.getName(), "equid = '" + equWarehouse.getParent() + "' ");
			if (list.size() > 0) {
				EquWarehouse wareParent = (EquWarehouse) list.get(0);
				if (wareParent.getIsleaf().toString().equals("1")) {
					wareParent.setIsleaf(0L);
					this.equipmentDAO.saveOrUpdate(wareParent);
				}
			}
			return "addSuccess";
		} else {
			this.equipmentDAO.saveOrUpdate(equWarehouse);
			return "updateSuccess";
		}
	}

	/**
	 * 在主体设备中领料用途中增加损坏赔偿累，并加入到工程概算同级树分类中去，即重新构造equBdgTree
	 * @param parentId
	 * @param bdgidStr
	 * @param codeName：从前台传过来的属性代码中的分类名称
	 * @return 树形结构list
	 * @author yanglh 2013-11-22
	 */
	private List<ColumnTreeNode> equBdgTreeOrPropertyCode(String parentId, String bdgidStr,String codeName) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String where = " parent = '" + parentId + "'";
		if (parentId.equals("01")) {
			String inStr = StringUtil.transStrToIn(bdgidStr, ",");
			where += " and bdgid in (" + inStr + ")";
		}
		
		List<BdgInfo> objects = this.equipmentDAO.findByWhere(BdgInfo.class
				.getName(), where, "bdgid");
		if(!codeName.equals("")){
			String whereS = "typeName = ( select uids from PropertyType where typeName ='"+codeName+"') and moduleName='"+parentId+"'";
			List<PropertyCode> obj = this.equipmentDAO.findByWhere(PropertyCode.class.getName(), whereS,"itemId");
			if(obj != null){
				for(int i = 0; i < obj.size(); i ++){
					PropertyCode code = obj.get(i);
					BdgInfo newBdgIndo = new BdgInfo();
					newBdgIndo.setBdgid(code.getPropertyCode());
					newBdgIndo.setBdgname(code.getPropertyName());
					newBdgIndo.setParent(code.getModuleName());
					newBdgIndo.setBdgno(code.getPropertyCode());
					newBdgIndo.setIsleaf(Long.valueOf(code.getDetailType()));
					objects.add(newBdgIndo);
				}
			}
		}
		Iterator<BdgInfo> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgInfo temp1 = (BdgInfo) itr.next();
			BdgInfo temp = new BdgInfo();
			try {
				BeanUtils.copyProperties(temp, temp1);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getBdgid()); // treenode.id
			n.setText(temp.getBdgname()); // treenode.text

			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("task");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("master-task"); // treenode.cls
				n.setIconCls("task-folder"); // treenode.iconCls
			}
			n.setIfcheck("none");
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;
	}

	/**
	 * 主体材料出库，根据领料用途，可选择此概算下的所有概算项和工程量
	 * @param parentId 父节点id
	 * @param bdgidStr 领料用途
	 * @param 
	 * @return
	 */
	private List<ColumnTreeNode> bdgProacmTree(String parentId, String bdgid, String relate) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if (bdgid == null || "".equals(bdgid)){
			return list;
		}
		List<BdgInfo> bdgInfos = new ArrayList<BdgInfo>();
		List<BdgProject> bdgProjects = new ArrayList<BdgProject>();
		parentId = parentId != null && !"".equals(parentId) ? parentId : "0";
		String where = "parent='" + parentId + "'";
		//如果是第一次加载，只加载根节点
		if (parentId.equals("0")){
			bdgInfos = this.equipmentDAO.findByWhere(BdgInfo.class.getName(), where, "bdgid");
		} else if (parentId.length() < bdgid.length()) {
			//按同样长度截取，获得需展开的bdgid，应该仅一条概算
			String bdgStr = "bdgid='" + bdgid.substring(0, parentId.length()+2) + "'";
			bdgInfos = this.equipmentDAO.findByWhere(BdgInfo.class.getName(), bdgStr, "bdgid");
		} else if (parentId.length() >= bdgid.length()){
			BdgInfo parentBdg = (BdgInfo) this.equipmentDAO.findById(BdgInfo.class.getName(), parentId);
			//2种情况，展开的是概算，且不是叶子结点，则下层是概算，否则下层是工程量
			if (parentBdg != null && parentBdg.getIsleaf() == 0L){
				bdgInfos = this.equipmentDAO.findByWhere(BdgInfo.class.getName(), where, "bdgid");
			} else {
				where = "bdgid='" + parentId + "'";
				bdgProjects = this.equipmentDAO.findByWhere(BdgProject.class.getName(), where, "proappid");
			}
		}

		if (bdgInfos != null && bdgInfos.size()>0){
			Iterator<BdgInfo> itr = bdgInfos.iterator();
			while (itr.hasNext()) {
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode n = new TreeNode();
				BdgInfo bdg = itr.next();
				BdgInfo temp = new BdgInfo();
				temp.setBdgid(bdg.getBdgid());
				temp.setBdgname(bdg.getBdgname());
				temp.setProno(bdg.getBdgno());
				
				int leaf = bdg.getIsleaf().intValue();
				n.setId(temp.getBdgid()); // treenode.id
				n.setText(temp.getBdgname()); // treenode.text

				if (leaf == 1) {
					n.setLeaf(true);
					n.setIconCls("task");
					//查询概算下是否有工程量
					List<BdgProject> bdgPrjs = this.equipmentDAO.findByWhere(BdgProject.class.getName(),
							"bdgid='" + bdg.getBdgid() + "'", "proappid");
					if (bdgPrjs != null && bdgPrjs.size()>0){
						n.setLeaf(false); // treenode.leaf
						n.setCls("master-task"); // treenode.cls
						n.setIconCls("task-folder"); // treenode.iconCls
					}
				} else {
					n.setLeaf(false); // treenode.leaf
					n.setCls("master-task"); // treenode.cls
					n.setIconCls("task-folder"); // treenode.iconCls
				}
				n.setIfcheck("none");
				cn.setTreenode(n); // ColumnTreeNode.treenode
				JSONObject jo = JSONObject.fromObject(temp);
				cn.setColumns(jo); // columns
				list.add(cn);
			}
		}
		if (bdgProjects != null && bdgProjects.size()>0){
			String[] relates = null;
			if (relate != null && !"".equals(relate)){
				relates = relate.split(",");
			}
			Iterator<BdgProject> itr = bdgProjects.iterator();
			while (itr.hasNext()) {
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode n = new TreeNode();
				BdgProject prj = itr.next();
				BdgInfo temp = new BdgInfo();
				temp.setBdgid(prj.getProappid());
				temp.setBdgname(prj.getProname());
				temp.setProno(prj.getProno());
				temp.setParent(prj.getBdgid());
				
				n.setId(temp.getBdgid()); // treenode.id
				n.setText(temp.getBdgname()); // treenode.text
				n.setLeaf(true);
				n.setIconCls("task");
				n.setIfcheck("true");
				cn.setTreenode(n); // ColumnTreeNode.treenode
				JSONObject jo = JSONObject.fromObject(temp);
				//设置是否勾选
				if (relates != null && relates.length>0){
					for (int i=0; i<relates.length; i++){
						if (relates[i].equals(temp.getBdgid())){
							jo.put("checked", true);
							break;
						} else {
							jo.put("checked", false);
						}
					}
				}
				cn.setColumns(jo); // columns
				list.add(cn);
			}
		}
		return list;
	}

}
