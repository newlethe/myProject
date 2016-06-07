package com.sgepit.pmis.finalAccounts.complete.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.poi.ss.usermodel.Workbook;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.hbm.BdgProject;
import com.sgepit.pmis.budget.hbm.VBdgConApp;
import com.sgepit.pmis.equipment.hbm.EquGoodsBodys;
import com.sgepit.pmis.finalAccounts.complete.dao.FACompleteDAO;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompFixedAssetList;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompFixedAssetTree;
import com.sgepit.pmis.finalAccounts.complete.hbm.FaInventoryAssetsView;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompEquWzBmInv;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedAsset;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedAssetBdgNum;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedAssetSbbodysNum;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedAssetWzoutNum;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedBdgProjectView;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStockOut;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStockOutSub;

public class FAFixedAssetServiceImpl implements FAFixedAssetService {
	
	public static FAFixedAssetServiceImpl getFromApplicationContext(ApplicationContext ctx) {
		return (FAFixedAssetServiceImpl) ctx.getBean("faFixedAssetService");
	}

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
	 * 构造固定资产分类树
	 * 
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 * @author zhangh 2013-06-26
	 */
	@SuppressWarnings({"unchecked", "rawtypes"})
	public List<ColumnTreeNode> getFACompFixedAssetTree(String orderBy,
			Integer start, Integer limit, HashMap map) {
		List<FACompFixedAssetTree> list = new ArrayList();
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		String parentid = (String) map.get("parentid");
		// 拼装一般查询语句
		list = faCompleteDAO.findByWhere(FACompFixedAssetTree.class.getName(),
				"pid = '" + pid + "' and parentid='" + parentid + "'", "treeid");
		List newList = DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
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
	public String getNewTreeid(String pid, String prefix, String col,
			String table, Long lsh) {
		String bh = "";
		String newLsh = "";
		if (lsh == null) {
			String sql = "select trim(to_char(nvl(max(substr(" + col
					+ ",length('" + prefix + "') +1, 2)),0) +1,'00')) from "
					+ table + " where pid = '" + pid + "' and  substr(" + col
					+ ",1,length('" + prefix + "')) ='" + prefix + "'";
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
	 * 保存固定资产分类
	 * @param assetTree
	 * @return
	 * @author zhangh 2013-06-27
	 */
	@SuppressWarnings("unchecked")
	public String saveOrUpdateFACompFixedAssetTree(
			FACompFixedAssetTree assetTree) {
		String uids = assetTree.getUids();
		if(uids == null || uids.equals("")){
			this.faCompleteDAO.insert(assetTree);
			// 新增完成后修改父节点isleaf值
			List<FACompFixedAssetTree> list = this.faCompleteDAO.findByWhere(
					FACompFixedAssetTree.class.getName(),
					"treeid = '" + assetTree.getParentid() + "'");
			if(list != null && list.size() > 0){
				FACompFixedAssetTree parentTree  = list.get(0);
				parentTree.setIsleaf(0l);
				this.faCompleteDAO.saveOrUpdate(parentTree);
			}
		}else{
			this.faCompleteDAO.saveOrUpdate(assetTree);
		}
		return "1";
	}

	/**
	 * 删除固定资产分类
	 * @param uids
	 * @return
	 * @author zhangh 2013-06-27
	 */
	@SuppressWarnings({"unchecked", "rawtypes"})
	public String deleteFACompFixedAssetTree(String uids) {
		FACompFixedAssetTree assetTree = (FACompFixedAssetTree) this.faCompleteDAO
				.findById(FACompFixedAssetTree.class.getName(), uids);
		if (assetTree != null) {
			this.faCompleteDAO.delete(assetTree);
			// 删除完成后， 判断是否修改isleaf状态
			List list = this.faCompleteDAO.findByWhere(
					FACompFixedAssetTree.class.getName(), "parentid = '"
							+ assetTree.getParentid() + "'");
			if (list == null || list.size() == 0) {
				List<FACompFixedAssetTree> parentList = this.faCompleteDAO
						.findByWhere(FACompFixedAssetTree.class.getName(),
								"treeid = '" + assetTree.getParentid() + "'");
				if (parentList != null && parentList.size() > 0) {
					FACompFixedAssetTree parentTree = parentList.get(0);
					parentTree.setIsleaf(1l);
					this.faCompleteDAO.saveOrUpdate(parentTree);
				}
			}
			return "1";
		} else {
			return "0";
		}
	}

	/**
	 * 判断固定资产分类节点是否有关联固定资产
	 * @param uids
	 * @return
	 * @author zhangh 2013-06-27
	 */
	@SuppressWarnings("rawtypes")
	public String treeHasFACompFixedAsset(String uids) {
		List list = this.faCompleteDAO.findByWhere(
				FacompFixedAsset.class.getName(), "typetreeuids='" + uids + "'");
		return list.size() > 0 ? "1" : "0";
	}

	/**
	 * 构造colmuntree
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		
		if (treeName.equalsIgnoreCase("getFACompFixedAssetList")) {
			String parentid = ((String[]) params.get("parentid"))[0];
			String pid = ((String[]) params.get("pid"))[0];
			list = this.getFACompFixedAssetList(parentid, pid);
		}
		
		if (treeName.equalsIgnoreCase("getFACompFixedAssetTree")) {
			String parentid = ((String[]) params.get("parentid"))[0];
			String pid = ((String[]) params.get("pid"))[0];
			list = this.getFACompFixedAssetTree(parentid, pid);
		}
		
		if (treeName.equalsIgnoreCase("getBdgTree")) {
			Iterator it = params.entrySet().iterator();
			String parentid ="";
			String bdgidStr = "";
			String pid = "";
			String conid = "";
			while(it.hasNext()){
				Map.Entry<String, String[]> entry = (Entry<String, String[]>) it.next();
				String field = entry.getKey().toString();
				String value = entry.getValue()[0];
				if("parentid".equals(field)){
					parentid = value;
				}else if("bdgid".equals(field)){
					bdgidStr = value;
				}else if("pid".equals(field)){
					pid = value;
				}else if("conid".equals(field)){
					conid = value;
				}
			}
			list = this.getBdgTree(parentid, pid, bdgidStr,conid);
		}
		return list;
	}

	/**
     * 固定资产清单树
     * @param parentid
     * @param whereStr
     * @param conid
     * @return
     */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> getFACompFixedAssetList(String parentid,
			String pid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String str = "";
		if (parentid != null && !parentid.equals("")) {
			str = " parentid='" + parentid + "'";
		}
		List<FACompFixedAssetList> list1 = this.faCompleteDAO.findByWhere(
				FACompFixedAssetList.class.getName(), str, "treeid asc");

		for (int i = 0; i < list1.size(); i++) {
			ColumnTreeNode cn = new ColumnTreeNode();
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
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(assetList);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;
	}

	/**
     * 固定资产分类树
     * @param parentid
     * @param whereStr
     * @param conid
     * @return
     */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> getFACompFixedAssetTree(String parentid,
			String pid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String str = "";
		if (parentid != null && !parentid.equals("")) {
			str = " parentid='" + parentid + "'";
		}
		List<FACompFixedAssetTree> list1 = this.faCompleteDAO.findByWhere(
				FACompFixedAssetTree.class.getName(), str, "treeid asc");

		for (int i = 0; i < list1.size(); i++) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			FACompFixedAssetTree assetList = (FACompFixedAssetTree) list1
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
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(assetList);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;
	}

	/**
	 * 保存固定资产
	 * @param assetList
	 * @return
	 * @author zhangh 2013-07-10
	 */
	@SuppressWarnings("unchecked")
	public String saveOrUpdateFACompFixedAssetList(
			FACompFixedAssetList assetList) {
		String uids = assetList.getUids();
		if(uids == null || uids.equals("")){
			this.faCompleteDAO.insert(assetList);
			// 新增完成后修改父节点isleaf值
			List<FACompFixedAssetList> list = this.faCompleteDAO.findByWhere(
					FACompFixedAssetList.class.getName(),
					"treeid = '" + assetList.getParentid() + "'");
			if(list != null && list.size() > 0){
				FACompFixedAssetList parentList  = list.get(0);
				parentList.setIsleaf(0l);
				this.faCompleteDAO.saveOrUpdate(parentList);
			}
		}else{
			this.faCompleteDAO.saveOrUpdate(assetList);
			List list = this.faCompleteDAO.findByWhere(FacompFixedAsset.class.getName(),"treeuids='"+assetList.getUids()+"'");
			if (list != null && list.size() > 0) {
				FacompFixedAsset asset = (FacompFixedAsset) list.get(0);
				asset.setFixedno(assetList.getFixedno());
				asset.setFixedname(assetList.getFixedname());
				this.faCompleteDAO.saveOrUpdate(asset);
			}
			
		}
		return "1";
	}

	/**
	 * 删除固定资产
	 * @param uids
	 * @return
	 * @author zhangh 2013-07-01
	 */
	@SuppressWarnings({"unchecked", "rawtypes"})
	public String deleteFACompFixedAssetList(String uids) {
		FACompFixedAssetList assetTree = (FACompFixedAssetList) this.faCompleteDAO
				.findById(FACompFixedAssetList.class.getName(), uids);
		if (assetTree != null) {
			this.faCompleteDAO.delete(assetTree);
			// 删除完成后， 判断是否修改isleaf状态
			List list = this.faCompleteDAO.findByWhere(
					FACompFixedAssetList.class.getName(), "parentid = '"
							+ assetTree.getParentid() + "'");
			if (list == null || list.size() == 0) {
				List<FACompFixedAssetList> parentList = this.faCompleteDAO
						.findByWhere(FACompFixedAssetList.class.getName(),
								"treeid = '" + assetTree.getParentid() + "'");
				if (parentList != null && parentList.size() > 0) {
					FACompFixedAssetList parentTree = parentList.get(0);
					parentTree.setIsleaf(1l);
					this.faCompleteDAO.saveOrUpdate(parentTree);
				}
			}
			return "1";
		} else {
			return "0";
		}
	}

	/**
	 * 判断固定资产清单节点是否有关联固定资产
	 * @param uids
	 * @return
	 * @author zhangh 2013-07-01
	 */
	@SuppressWarnings("rawtypes")
	public String listHasFACompFixedAsset(String uids) {
		List list = this.faCompleteDAO.findByWhere(
				FacompFixedAsset.class.getName(), "treeuids='" + uids + "'");
		return list.size() > 0 ? "1" : "0";
	}

	/**
	 * 保存或修改固定资产清单
	 * @param fixedAsset
	 * @return
	 * @author zhangh 2013-07-10
	 */
	public String saveOrUpdateFACompFixedAsset(FacompFixedAsset fixedAsset){
		String uids = fixedAsset.getUids();
		if(uids == null || uids.equals("")){
			this.faCompleteDAO.insert(fixedAsset);
			initGclAndSbgzf(fixedAsset.getPid(), fixedAsset.getTreeid());
		}else{
			this.faCompleteDAO.saveOrUpdate(fixedAsset);
		}
		return "1";
	}

	/**
	 * 获取概算树
	 * @param parentid
	 * @param pid
	 * @return
	 */
	public List<ColumnTreeNode> getBdgTree(String parentid,
			String pid, String bdgidStr, String conid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String str = " 1=1";
		if (parentid != null && !parentid.equals("")) {
			str += " and parent='" + parentid + "'";
		}
		if (conid != null && !conid.equals("")) {
			str += " and conid='" + conid + "'";
		}
		if (parentid.equals("01") && !bdgidStr.equals("")) {
			String inStr = StringUtil.transStrToIn(bdgidStr, ",");
			str += " and bdgid in (" + inStr + ")";
		}
		List<VBdgConApp> list1 = this.faCompleteDAO.findByWhere(
				VBdgConApp.class.getName(), str, "bdgid");

		for (int i = 0; i < list1.size(); i++) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			VBdgConApp vBdgConApp = (VBdgConApp) list1.get(i);
			Long leaf = vBdgConApp.getIsleaf();
			n.setId(vBdgConApp.getBdgid()); // treenode.id
			n.setText(vBdgConApp.getBdgname()); // treenode.text
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("master-task"); // treenode.cls
				n.setIconCls("icon-pkg"); // treenode.iconCls icon-pkg 文件夹样式
											// task-folder
			}
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(vBdgConApp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;
	}

	/**
	 * 固定资产信息中，建筑工程-工程量 中构建工程量树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 * @throws BusinessException
	 * @author zhangh 2013-07-13
	 */
	public List<ColumnTreeNode> buildFacompFixedBdgProjectViewTree(String orderBy, Integer start, Integer limit, HashMap map)
			throws BusinessException {
		List<BdgProject> list = new ArrayList();
		// 页面定义处的参数
		String parent = (String) map.get("parent");
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		String conid = (String) map.get("conid");
		String bdgid = (String) map.get("bdgid");
		String fixeduids = (String) map.get("fixeduids");

		// 拼装一般查询语句
		list = this.faCompleteDAO.findByWhere(
				FacompFixedBdgProjectView.class.getName(), " parent='" + parent
						+ "' and pid='" + pid + "' and conid='" + conid
						+ "' and bdgid = '" + bdgid + "' and fixeduids = '"
						+ fixeduids + "' ", "treeid");

		List newList = DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}

	/**
	 * 建筑工程-工程量 选择合同后，初始化所属工程量和金额
	 * @param fixeduids
	 * @param conid
	 * @author zhangh 2013-07-17
	 */
	public void initFacompFixedAssetBdgNum(String fixeduids, String conid, String bdgidtype) {
		List list = this.faCompleteDAO.findByWhere(
				FacompFixedBdgProjectView.class.getName(), "conid='" + conid
						+ "' and  bdgid like '"+bdgidtype+"%'");
		for (int i = 0; i < list.size(); i++) {
			FacompFixedBdgProjectView view = (FacompFixedBdgProjectView) list
					.get(i);
			// 判断是否存在，存在则跳过，不重复添加
			List numList = this.faCompleteDAO.findByWhere(
					FacompFixedAssetBdgNum.class.getName(), "fixeduids='"
							+ fixeduids + "' and conid='" + conid
							+ "' and proappid='" + view.getProappid() + "'");
			if (numList.size() < 1) {
				FacompFixedAssetBdgNum bdgNum = new FacompFixedAssetBdgNum();
				bdgNum.setConid(conid);
				bdgNum.setFixeduids(fixeduids);
				bdgNum.setProappid(view.getProappid());
//				bdgNum.setJe(view.getTzwcJe());
//				bdgNum.setGcl(view.getTzwcGcl());
				bdgNum.setJe(0d);
				bdgNum.setGcl(0d);
				bdgNum.setIsper(view.getIsper());
				bdgNum.setBdgidtype(bdgidtype);
				this.faCompleteDAO.insert(bdgNum);
			}
		}
	}

	/**
	 * 建筑工程-材料 选择合同后，初始化使用数量和使用金额
	 * @param fixeduids
	 * @param conid
	 * @author zhangh 2013-07-19
	 */
	public void initFacompFixedAssetWzoutNum(String fixeduids, String conid, String bdgidtype) {
		List list = this.faCompleteDAO.findByWhere(
				WzGoodsStockOutSub.class.getName(),
				"outId in (select uids from " + WzGoodsStockOut.class.getName()
						+ " where conid = '" + conid
						+ "' and auditState = '1')");
		if (list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				WzGoodsStockOutSub out = (WzGoodsStockOutSub) list.get(i);

				// 判断是否存在，存在则跳过，不重复添加
				List numList = this.faCompleteDAO.findByWhere(
						FacompFixedAssetWzoutNum.class.getName(), "fixeduids='"
								+ fixeduids + "' and conid='" + conid
								+ "' and outuids='" + out.getUids() + "'");
				if (numList.size() < 1) {
					FacompFixedAssetWzoutNum num = new FacompFixedAssetWzoutNum();
					num.setFixeduids(fixeduids);
					num.setConid(conid);
					num.setOutuids(out.getUids());
//					num.setUsenum(out.getOutNum());
					num.setUsenum(0d);
					num.setBdgidtype(bdgidtype);
					Double usemoney = 0d;
					if (out.getOutNum() != null && out.getPrice() != null) {
						usemoney = (out.getOutNum() * out.getPrice());
					}
//					num.setUsemoney(usemoney);
					num.setUsemoney(0d);
					this.faCompleteDAO.insert(num);
				}
			}
		}
	}

	/**
	 * 保存所选的设备购置费，并更新总金额到固定资产
	 * @param fixeduids
	 * @param selectConid
	 * @param recArr
	 * @return
	 */
	public String updateFacompFixedAssetSbbodysNum(String fixeduids,String selectConid,EquGoodsBodys[] recArr){
		Double money = 0d;
		List<FacompFixedAssetSbbodysNum> oldlist = this.faCompleteDAO.findByWhere(FacompFixedAssetSbbodysNum.class.getName(),
				"conid = '"+selectConid+"' and fixeduids = '"+fixeduids+"'");
		this.faCompleteDAO.deleteAll(oldlist);
		for (int i = 0; i < recArr.length; i++) {
			EquGoodsBodys bodys = recArr[i];
			if(bodys!=null){
				Double thisMoney = bodys.getTotalMoney() == null ? 0d : bodys.getTotalMoney(); 
				money += thisMoney;
				FacompFixedAssetSbbodysNum num = new FacompFixedAssetSbbodysNum();
				num.setConid(selectConid);
				num.setFixeduids(fixeduids);
				num.setMoney(thisMoney);
				num.setOutuids(bodys.getUids());
				this.faCompleteDAO.insert(num);
			}
		}
		FacompFixedAsset asset = (FacompFixedAsset) this.faCompleteDAO.findById(FacompFixedAsset.class.getName(), fixeduids);
		if(asset != null){
			asset.setSbgzf(money);
			this.faCompleteDAO.saveOrUpdate(asset);
		}
		return "1";
	}

	/**
	 * 库存资产管理信息初始化
	 * @param obj
	 * @return
	 * yanglh 2013-07-25
	 */
	public String insertFromKcToFacompEquWzBmInv(String pid) {
		List<FaInventoryAssetsView> list = this.faCompleteDAO.findByWhere(FaInventoryAssetsView.class.getName(), " 1=1 ");
		if(list.size()>0){
			List<FacompEquWzBmInv> lists = this.faCompleteDAO.findByWhere(FacompEquWzBmInv.class.getName(), "1=1");
			if(lists.size() >0){
				for(int i=0;i<list.size();i++){
					FaInventoryAssetsView objView1 = list.get(i);
					List<FacompEquWzBmInv> list1 = this.faCompleteDAO.findByWhere(FacompEquWzBmInv.class.getName(), "kc_uids='"+objView1.getUids()+"'");
					if(list1.size()==1){
						FacompEquWzBmInv objInv1 = list1.get(0);
						objInv1.setStockNum(objView1.getStockNum());
						this.faCompleteDAO.saveOrUpdate(objInv1);
					}else{
						FaInventoryAssetsView objView =  list.get(i);
						FacompEquWzBmInv objInv = new FacompEquWzBmInv();
						objInv.setPid(pid);
						objInv.setAssetsName(objView.getEquPartName());
						objInv.setStockNo(objView.getStockNo());
						objInv.setGgxh(objView.getGgxh());
						objInv.setStorage(objView.getStorage());
						objInv.setUnit(objView.getUnit());
						objInv.setStockNum(objView.getStockNum());
						objInv.setKcMoney(objView.getKcMoney());
						objInv.setKcUids(objView.getUids());
						objInv.setDatetype(objView.getDatetype());
						objInv.setConid(objView.getConid());
						this.faCompleteDAO.insert(objInv);
					}
				}
			}else{
				for(int j=0;j<list.size();j++){
					FaInventoryAssetsView objView =  list.get(j);
					FacompEquWzBmInv objInv = new FacompEquWzBmInv();
					objInv.setPid(pid);
					objInv.setAssetsName(objView.getEquPartName());
					objInv.setStockNo(objView.getStockNo());
					objInv.setGgxh(objView.getGgxh());
					objInv.setStorage(objView.getStorage());
					objInv.setUnit(objView.getUnit());
					objInv.setStockNum(objView.getStockNum());
					objInv.setKcMoney(objView.getKcMoney());
					objInv.setKcUids(objView.getUids());
					objInv.setDatetype(objView.getDatetype());
					objInv.setConid(objView.getConid());
					this.faCompleteDAO.insert(objInv);
				}
				
			}
			return "success";
		}else{
			return "failure";
		}
	}

	/**
	 * 初始化固定资产信息的建筑工程-工程量，安装工程-工程量，设备购置费
	 * @param pid	项目ID
	 * @param treeid	固定资产清单树treeid
	 * @return	初始化的数据数
	 * @author pengy 2013-09-02
	 */
	@SuppressWarnings("unchecked")
	public String initGclAndSbgzf(String pid, String treeid){
		List<FacompFixedAsset> fixedAssets = this.faCompleteDAO.findByWhere(FacompFixedAsset.class.getName(),
				"pid = '" + pid + "' and treeid like '" + treeid + "%'", "uids");
		if (fixedAssets == null || fixedAssets.size() < 1){
			return "0";
		}
		for(FacompFixedAsset fixedAsset : fixedAssets){
			String treeidNew = fixedAsset.getTreeid();
			//建筑部分概算主键0101,建筑部分概算下，当前固定资产清单分类的已稽核的工程量本次投资完成之和
			List<BigDecimal> buildMoney = this.faCompleteDAO.getDataAutoCloseSes("select NVL(SUM(t.tzwc_je),0) from " +
					"FACOMP_ASSET_LIST_REPORT_VIEW t where t.bdgid like '" + pid + "-0101%' and t.fixed_asset_list='" + treeidNew + "'");
			//安装部分概算主键0103,安装部分概算下，当前固定资产清单分类的已稽核的工程量本次投资完成之和
			List<BigDecimal> installMoney = this.faCompleteDAO.getDataAutoCloseSes("select NVL(SUM(t.tzwc_je),0) from " +
					"FACOMP_ASSET_LIST_REPORT_VIEW t where t.bdgid like '" + pid + "-0103%' and t.fixed_asset_list='" + treeidNew + "'");
			//设备购置费取当前固定资产清单分类的已稽核的出库单的明细出库金额之和
			List<BigDecimal> sbgzfMoney = this.faCompleteDAO.getDataAutoCloseSes("select NVL(SUM(t.amount),0) from " +
					"EQU_GOODS_STOCK_OUT_SUB t where t.out_id in (select o.uids from EQU_GOODS_STOCK_OUT o where " +
					"o.audit_state='1' and o.Data_Type='EQUBODY' and o.pid='" + pid + "' and o.fixed_asset_list='" + treeidNew + "')");
			fixedAsset.setJzgcGcl(buildMoney.get(0).doubleValue());
			fixedAsset.setAzgcGcl(installMoney.get(0).doubleValue());
			fixedAsset.setSbgzf(sbgzfMoney.get(0).doubleValue());
			this.faCompleteDAO.saveOrUpdate(fixedAsset);
		}
		Integer size = fixedAssets.size();
		return size.toString();
	}

	public List<ColumnTreeNode> buildFacompAssetListReportViewTree(String orderBy, Integer start, Integer limit, HashMap map) throws BusinessException {
		// TODO Auto-generated method stub
		return null;
	}

	public String addFACompFixedAssetList(String pid, String equid, String outId, String getUsing, String equOrCl) {
		System.out.println("faFixedAssetService.addFACompFixedAssetList");
		return "true";
	}

	public boolean initFixedAsset(String pid) {
		// TODO Auto-generated method stub
		return false;
	}

	public String initTjAsset(String pid) {
		// TODO Auto-generated method stub
		return null;
	}

	public String delTjAsset(String pid) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<ColumnTreeNode> fafixedassetquerytree(String orderBy, Integer start, Integer limit, HashMap map) {
		// TODO Auto-generated method stub
		return null;
	}

	public InputStream getExcelTemplate(String businessType) {
		// TODO Auto-generated method stub
		return null;
	}

	public ByteArrayOutputStream fillDataToFixedAssetExcel(Workbook wb, Map<String, String> map1) throws DbPropertyException, SQLException, IOException, ExcelPortException {
		// TODO Auto-generated method stub
		return null;
	}

}
