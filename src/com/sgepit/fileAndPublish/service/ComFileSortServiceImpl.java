package com.sgepit.fileAndPublish.service;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.sgepit.fileAndPublish.FAPConstant;
import com.sgepit.fileAndPublish.dao.ComFileSortDAO;
import com.sgepit.fileAndPublish.dao.ComFileSortDeptDAO;
import com.sgepit.fileAndPublish.hbm.ComFileSort;
import com.sgepit.fileAndPublish.hbm.ComFileSortDept;
import com.sgepit.fileAndPublish.hbm.ComFileSortRightBean;
import com.sgepit.fileAndPublish.hbm.IssueFileSortUnit;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.JdbcUtil;

public class ComFileSortServiceImpl extends BaseMgmImpl implements
		IComFileSortService {
	private static final Log log = LogFactory
			.getLog(ComFileSortServiceImpl.class);
	private ComFileSortDAO comFileSortDAO;// 文档分类树DAO对象
	private ComFileSortDeptDAO comFileSortDeptDAO; // 分类节点对应部门权限DAO对象

	/**
	 * 根据父层节点ID获取新的子节点编号
	 * 
	 * @param parentId
	 * @return
	 */
	public String getNewSortBhByParentId(String parentId) {
		Map map = this.getNewPxhForSortTree(parentId);
		if (map != null && map.get("pxhFull") != null) {
			return map.get("pxhFull").toString();
		} else {
			return "";
		}
	}

	/**
	 * 根据父节点ID找到所有他的所有儿子节点
	 * 
	 * @param parentId
	 *            父节点ID
	 * @param deptIds
	 *            访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @return 儿子节点实体List
	 */
	@SuppressWarnings("unchecked")
	public List<ComFileSort> getComFileNodesByParentId(String parentId,
			String deptIds) {
		List<Map> list = new ArrayList<Map>();
		List<ComFileSort> beanList = new ArrayList<ComFileSort>();
		String sql = "select uids,sort_bh as sortBh,sort_name as sortName ,parent_id as parentId, pxh, pxh_full as pxhFull, pid from"
				+ " COM_FILE_SORT t  where parent_id ='" + parentId + "' ";
		if (deptIds != null) {
			sql += " and uids in (select file_sort_id from com_file_sort_dept where dept_id in "
					+ this.transStrForSqlIn(deptIds, FAPConstant.SPLITB) + ") ";
		}
		sql += " order by pxh_full";
		list = JdbcUtil.query(sql);

		for (int i = 0; i < list.size(); i++) {
			Map map = list.get(i);
			ComFileSort hbm = new ComFileSort();
			try {
				BeanUtils.populate(hbm, map); // map的key均是大写，无法populate到hbm
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				log.error(e.getMessage());
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				log.error(e.getMessage());
				e.printStackTrace();
			}
			beanList.add(hbm);
		}
		return beanList;
	}

	/**
	 * 根据父节点查找以该父节点为根节点的所有节点，构成树结构
	 * 
	 * @param parentId
	 *            父节点ID
	 * @param deptIds
	 *            访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @return Map List，map的key 与实体的属性对应
	 */
	@SuppressWarnings("unchecked")
	public List<Map> getComFileSortTreeByParentId(String parentId,
			String deptIds) {
		List<Map> list = new ArrayList<Map>();
		String sql = "select uids,sort_bh as sortBh,sort_name as sortName ,parent_id as parentId, pxh, pxh_full as pxhFull, pid, childNodeNum,is_sync from"
				+ " (select uids,sort_bh,sort_name,parent_id, pxh, pxh_full, pid, is_sync, "
				+ " (select count(uids) from COM_FILE_SORT where parent_id = t.uids ";
		if (deptIds != null) {
			sql += " and uids in (select file_sort_id from com_file_sort_dept where right_lvl <> '"
					+ FAPConstant.right_None
					+ "'  and dept_id in "
					+ this.transStrForSqlIn(deptIds, FAPConstant.SPLITB)
					+ ")) as childNodeNum"
					+ " from COM_FILE_SORT t "+  "where uids in (select file_sort_id from com_file_sort_dept where right_lvl <> '"
					+ FAPConstant.right_None
					+ "'  and dept_id in "
					+ this.transStrForSqlIn(deptIds, FAPConstant.SPLITB) + ") start WITH uids = '"
					+ parentId
					+ "' connect by PRIOR uids = parent_id order siblings by pxh_full)"
					;
		} else {
			sql += ") as childNodeNum"
					+ " from COM_FILE_SORT t start WITH uids = '" + parentId
					+ "' connect by PRIOR uids = parent_id order siblings by pxh_full)";
		}
		//sql += " order by pxh_full";
		list = JdbcUtil.query(sql);
		return list;
	}

	/**
	 * 增加节点方法 节点编号自动设置，与全路径排序号一致,新增加点后还需要将新增该节点的用户对应的部门信息写入到权限表
	 * 
	 * @param parentId
	 *            父层节点ID
	 * @param sortNodeName
	 *            节点名称
	 * @param deptIds
	 *            访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @return
	 */
	public boolean addNodeForComFileSortTree(String parentId,
			String sortNodeName, String deptIds, String pid) {
		return addNodeForComFileSortTree(parentId, sortNodeName, deptIds, pid,
				null);
	}

	/**
	 * 增加节点方法
	 * 
	 * @param parentId
	 *            父层节点ID
	 * @param sortNodeName
	 *            节点名称
	 * @param deptIds
	 *            访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @param sortNodeBh
	 *            节点编号【用户自定义的编号】
	 * @return
	 */
	public boolean addNodeForComFileSortTree(String parentId,
			String sortNodeName, String deptIds, String pid, String sortNodeBh) {

		boolean addResult = false;
		try {
			Map<String, String> map = this.getNewPxhForSortTree(parentId);
			if (map != null) {
				if (map.get("pxh") != null && map.get("pxhFull") != null) {
					int order = Integer.valueOf(map.get("pxh"));
					String orderStr = map.get("pxhFull").toString();
					ComFileSort newCfs = new ComFileSort();
					newCfs.setParentId(parentId);
					newCfs.setPxh(Long.valueOf(order));
					newCfs.setPxhFull(orderStr);
					if (sortNodeBh == null) {
						newCfs.setSortBh(orderStr);
					} else {
						newCfs.setSortBh(sortNodeBh);
					}

					// 设置PID
					newCfs.setPid(pid);
					// 设置同步状态
					newCfs.setIsSync(false);

					newCfs.setSortName(sortNodeName);
					String newSortId = this.comFileSortDAO.insert(newCfs);
					if (newSortId != null) {
						// 复制上层节点的权限信息
						// List<ComFileSortDept> pRList =
						// this.comFileSortDeptDAO
						// .findWhere("file_sort_id = '" + parentId + "'");
						// if (pRList.size() > 0) {
						// for (int i = 0; i < pRList.size(); i++) {
						// ComFileSortDept pRHbm = pRList.get(i);
						// ComFileSortDept hbm = new ComFileSortDept();
						// hbm.setDeptId(pRHbm.getDeptId());
						// hbm.setFileSortId(newSortId);
						// hbm.setRightLvl(pRHbm.getRightLvl());
						// this.comFileSortDeptDAO.insert(hbm);
						// }
						// }
						// 新增分类用户所在部门或单位具备该分类的所有读写权限
						if (deptIds != null) {
							String[] deptIdArr = deptIds
									.split(FAPConstant.SPLITB);
							for (int i = 0; i < deptIdArr.length; i++) {
								List<ComFileSortDept> rList = this.comFileSortDeptDAO
										.findWhere("file_sort_id = '"
												+ newSortId
												+ "' and dept_id = '"
												+ deptIdArr[i] + "'");
								if (rList.size() == 1) {
									ComFileSortDept hbm = rList.get(0);
									hbm.setRightLvl(FAPConstant.right_Write);
									this.comFileSortDeptDAO.saveOrUpdate(hbm);
								} else {
									ComFileSortDept hbm = new ComFileSortDept();
									hbm.setDeptId(deptIdArr[i]);
									hbm.setFileSortId(newSortId);
									hbm.setRightLvl(FAPConstant.right_Write);
									this.comFileSortDeptDAO.insert(hbm);
								}
							}
						}
						addResult = true;
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return addResult;
	}

	/**
	 * 更新节点名称或编号
	 * 
	 * @param nodeName
	 * @return
	 */
	public boolean updateNodeInfo(String nodeId, String nodeName, String nodeBh) {
		try {
			ComFileSort hbm = (ComFileSort) this.comFileSortDAO
					.findById(nodeId);
			hbm.setSortName(nodeName);
			hbm.setSortBh(nodeBh);
			this.comFileSortDAO.saveOrUpdate(hbm);
			return true;
		} catch (Exception e) {
			log.error("更新节点名称失败，具体原因：" + e.getMessage());
			return false;
		}
	}

	/**
	 * 删除节点
	 * 
	 * @param nodeId
	 * @return
	 */
	public boolean deleteNode(String nodeId) {
		ComFileSort curHbm = (ComFileSort) this.comFileSortDAO.findById(nodeId);
		Long curpxh = curHbm.getPxh();
		String curParentId = curHbm.getParentId();
		try {
			List list = this.comFileSortDAO.findWhere("parent_id = '" + nodeId
					+ "'");
			if (list.size() > 0) {
				String sql = "select uids from  com_file_sort where uids in "
						+ "(select uids from com_file_sort t start WITH uids = '"
						+ nodeId + "' connect by PRIOR uids = parent_id)";
				List<Map> delList = JdbcUtil.query(sql);
				for (int j = 0; j < delList.size(); j++) {
					Map map = delList.get(j);
					String uids = map.get("uids").toString();
					// 删除权限表数据
					List<ComFileSortDept> rightList = this.comFileSortDeptDAO
							.findWhere("file_sort_id= '" + uids + "'");
					this.comFileSortDeptDAO.deleteAll(rightList);
					// 删除大对象表数据
					String delBlobSql = "delete sgcc_attach_blob where file_lsh in (select file_lsh from sgcc_attach_list where"
							+ " transaction_type = 'FAPTemplate' and transaction_id = '"
							+ uids + "')";
					JdbcUtil.execute(delBlobSql);
					// 删除模板表数据
					String delTemplateSql = "delete sgcc_attach_list where transaction_type = 'FAPTemplate' and transaction_id = '"
							+ uids + "'";
					JdbcUtil.execute(delTemplateSql);
					// 删除分类
					this.comFileSortDAO
							.delete((ComFileSort) this.comFileSortDAO
									.findById(uids));
				}
			} else {
				// 删除权限表数据
				List<ComFileSortDept> rightList = this.comFileSortDeptDAO
						.findWhere("file_sort_id= '" + nodeId + "'");
				this.comFileSortDeptDAO.deleteAll(rightList);
				// 删除大对象表数据
				String delBlobSql = "delete sgcc_attach_blob where file_lsh in (select file_lsh from sgcc_attach_list where"
						+ " transaction_type = 'FAPTemplate' and transaction_id = '"
						+ nodeId + "')";
				JdbcUtil.execute(delBlobSql);
				// 删除模板表数据
				String delTemplateSql = "delete sgcc_attach_list where transaction_type = 'FAPTemplate' and transaction_id = '"
						+ nodeId + "'";
				JdbcUtil.execute(delTemplateSql);
				// 删除分类
				this.comFileSortDAO.delete(curHbm);
			}
			// 重新排列排序号会导致删除分类后再新增的编号有可能与现有编号重复的问题
			// String where = "pxh>="+ curpxh
			// +" and parent_id='"+curParentId+"'";
			// List<ComFileSort> orderlist =
			// this.comFileSortDAO.findWhere(where);
			// if(orderlist != null && orderlist.size()>0){
			// this.setComFileSortTreeOrder(orderlist,"delete");
			// }
			return true;
		} catch (Exception e) {
			log.error("删除节点失败，具体原因：" + e.getMessage());
			return false;
		}
	}

	/**
	 * 移动分类树节点
	 * 
	 * @param nodeId
	 *            移动节点ID
	 * @param relationNodeId
	 *            被移动
	 * @param type
	 * @return
	 */
	public boolean moveComFileSortTreeNode(String nodeId,
			String relationNodeId, String type) {
		try {
			ComFileSort hbm = (ComFileSort) this.comFileSortDAO
					.findById(nodeId);
			if (type.equals("append")) { // 变更父节点，relationNodeId是新的父节点ID
				Long curPxh = hbm.getPxh();
				String curParentId = hbm.getParentId();
				hbm.setParentId(relationNodeId);
				Map<String, String> map = this
						.getNewPxhForSortTree(relationNodeId);
				if (map != null) {
					if (map.get("pxh") != null && map.get("pxhFull") != null) {
						int order = Integer.valueOf(map.get("pxh"));
						String orderStr = map.get("pxhFull").toString();
						hbm.setPxh(Long.valueOf(order));
						hbm.setPxhFull(orderStr);
						this.comFileSortDAO.saveOrUpdate(hbm);
						String where = "pxh>=" + curPxh + " and parent_id='"
								+ curParentId + "'";
						List<ComFileSort> orderlist = this.comFileSortDAO
								.findWhere(where);
						if (orderlist != null && orderlist.size() > 0) {
							this.setComFileSortTreeOrder(orderlist, "delete");
						}
					}
				}
			} else {
				ComFileSort relationHbm = (ComFileSort) this.comFileSortDAO
						.findById(relationNodeId);
				ComFileSort relationParentHbm = (ComFileSort) this.comFileSortDAO
						.findById(relationHbm.getParentId());
				if (type.equals("above")) { // 同层次移动，移动到relationNodeId节点上面
					Long curOrder = relationHbm.getPxh() - 1;
					if (curOrder == 0) {
						curOrder = 1L;
					}
					String where = "pxh=" + curOrder + " and parent_id='"
							+ relationHbm.getParentId() + "'";
					List<ComFileSort> list = this.comFileSortDAO
							.findWhere(where);

					if (list != null && list.size() > 0) {
						curOrder = relationHbm.getPxh();
						where = "pxh>=" + (relationHbm.getPxh())
								+ " and pxh < " + hbm.getPxh()
								+ " and parent_id='"
								+ relationHbm.getParentId() + "'";
						List<ComFileSort> orderlist = this.comFileSortDAO
								.findWhere(where);
						if (orderlist != null && orderlist.size() > 0) {
							this.setComFileSortTreeOrder(orderlist, "move");
						}
					}
					hbm.setPxh(curOrder);
					hbm.setPxhFull(this.getFullPxh(relationParentHbm
							.getPxhFull(), String.valueOf(curOrder)));
					this.comFileSortDAO.saveOrUpdate(hbm);
				} else if (type.equals("below")) { // 同层次移动，移动到relationNodeId节点下面
					Long curOrder = relationHbm.getPxh() + 1;
					String where = "pxh=" + curOrder + " and parent_id='"
							+ relationHbm.getParentId() + "'";
					List<ComFileSort> list = this.comFileSortDAO
							.findWhere(where);
					if (list != null && list.size() > 0) {
						where = "pxh>" + curOrder + " and parent_id='"
								+ relationHbm.getParentId() + "'";
						List orderlist = this.comFileSortDAO.findWhere(where);
						if (orderlist != null && orderlist.size() > 0) {
							this.setComFileSortTreeOrder(orderlist, "move");
						}
					}
					hbm.setPxh(curOrder);
					hbm.setPxhFull(this.getFullPxh(relationParentHbm
							.getPxhFull(), String.valueOf(curOrder)));
					this.comFileSortDAO.saveOrUpdate(hbm);
				}
			}
			return true;
		} catch (Exception e) {
			log.error("节点移动失败，具体原因：" + e.getMessage());
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 设置节点可访问的部门及权限
	 * 
	 * @param nodeId
	 * @param rightMap
	 * @return
	 */
	public boolean setComFileSortNodeRight(String nodeId,
			Map<String, String> rightMap) {
		try {
			Iterator it = rightMap.entrySet().iterator();
			while (it.hasNext()) {
				Entry entry = (Entry) it.next();
				String deptId = entry.getKey().toString();
				String rightLvl = entry.getValue() == null ? FAPConstant.right_ReadOnly
						: entry.getValue().toString();
				List<ComFileSortDept> list = this.comFileSortDeptDAO
						.findWhere("file_sort_id = '" + nodeId
								+ "' and dept_id = '" + deptId + "'");
				if (list.size() == 1) {
					ComFileSortDept hbm = list.get(0);
					hbm.setRightLvl(rightLvl);
					this.comFileSortDeptDAO.saveOrUpdate(hbm);
				} else {
					ComFileSortDept hbm = new ComFileSortDept();
					hbm.setDeptId(deptId);
					hbm.setFileSortId(nodeId);
					hbm.setRightLvl(rightLvl);
					this.comFileSortDeptDAO.insert(hbm);
				}
			}
			return true;
		} catch (Exception e) {
			log.error("设置节点部门权限失败，具体原因：" + e.getMessage());
			return false;
		}
	}
	
	public void setSyncStatus(String nodeId, Boolean sync) throws BusinessException {
		String syncStr = sync ? "1" : "0";
		String sql = "update com_file_sort set is_sync ="+ syncStr + " where uids = '" + nodeId + "'";
		JdbcUtil.update(sql);
	}

	/**
	 * 下发文件分类
	 * 
	 * @param rootId
	 * @throws BusinessException
	 */
	public String issueFileSort(String rootId) throws BusinessException {
		String whereStr = "appUrl is not null and unitid in " +
				"( select deptId from ComFileSortDept dept where fileSortId = '%s' and rightLvl != 'None' ) " +
				"order by unitid";
		whereStr = String.format(whereStr, rootId);
		List<SgccIniUnit> unitList = comFileSortDAO.findByWhere(
				SgccIniUnit.class.getName(),
				whereStr);
		List<SgccIniUnit> sendUnitList = new ArrayList<SgccIniUnit>();
		List<String> urlTempList = new ArrayList<String>();

		for (SgccIniUnit unit : unitList) {
			if (urlTempList.contains(unit.getAppUrl())) {
				continue;
			}
			sendUnitList.add(unit);
			urlTempList.add(unit.getAppUrl());
		}

		// 记录包括3张表com_file_sort, sgcc_attach_list,
		// sgcc_attach_blob
		List<ComFileSort> sortList;
		List<SgccAttachList> attachList = new ArrayList<SgccAttachList>();

		// 取得文件分类列表
		DetachedCriteria criteria = DetachedCriteria
				.forClass(ComFileSort.class);
		String sql = String
				.format(
						"1 = 1 start with uids = '%s' connect by prior uids = parent_id ",
						rootId);
		criteria.add(Restrictions.sqlRestriction(sql));

		sortList = comFileSortDAO.getHibernateTemplate().findByCriteria(
				criteria);

		// 找到所有分类对应的模板记录
		for (ComFileSort fileSort : sortList) {

			// attachList 列表
			List<SgccAttachList> attachTempList = comFileSortDAO.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type = 'FAPTemplate' and transaction_id ='"
							+ fileSort.getUids() + "'");

			attachList.addAll(attachTempList);
		}

		List allDataList = new ArrayList();
		allDataList.addAll(sortList);
		allDataList.addAll(attachList);

		String beforeSql = "delete from sgcc_attach_blob t where t.file_lsh in ( select t2.file_lsh from sgcc_attach_list t2 where t2.transaction_type = 'FAPTemplate' and t2.transaction_id in ( select uids from com_file_sort t3 start with t3.parent_id = '"
				+ rootId + "' connect by prior uids = parent_id ) );";
		beforeSql += "delete from sgcc_attach_list t where t.transaction_type = 'FAPTemplate' and t.transaction_id in ( select uids from com_file_sort t2 start with t2.parent_id = '"
				+ rootId + "' connect by prior uids = parent_id );";
		beforeSql += "delete from com_file_sort t where t.uids in ( select uids from com_file_sort t2 start with t2.parent_id = '"
				+ rootId + "' connect by prior uids = parent_id)";
		
		String afterSql = "delete from com_file_sort_dept t where t.file_sort_id not in " +
				"( select uids from com_file_sort )";

		PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");

		String retMessage = "";
		boolean allSuccess = true;
		for (SgccIniUnit unit : sendUnitList) {
			String pid = unit.getUnitid();
			//不先清空分类，直接覆盖 
			List<PcDataExchange> exchangeList = dataExchangeService
					.getExcDataList(allDataList, pid,Constant.DefaultOrgRootID, null, afterSql,"下发文件分类");

			List<PcDataExchange> blobExchangeList = new ArrayList<PcDataExchange>();
			// 手动生成所有attachBlob的dataExchange记录
			for (SgccAttachList attach : attachList) {
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("SGCC_ATTACH_BLOB");
				exchange.setBlobCol("FILE_NR");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("FILE_LSH", attach.getFileLsh());
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				// // 判断数据是否已经存在于报送队列
				// List lt = comFileSortDAO.findByWhere(
				// PcDataExchange.class.getName(),
				// "tableName='SGCC_ATTACH_BLOB' and keyValue='"
				// + exchange.getKeyValue() + "'");
				// if (lt.size() > 0) {
				// comFileSortDAO.deleteAll(lt);
				// }
				blobExchangeList.add(exchange);
			}

			// for (PcDataExchange pcDataExchange : exchangeList) {
			// comFileSortDAO.saveOrUpdate(pcDataExchange);
			// }
			// 再将生成的attach_blob记录添加到队列中
			// 当前的xh, tx_group
			PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
			Long curXh = tempExc.getXh() + 1;
			String curTxGroup = tempExc.getTxGroup();
			
			for (int i = 0; i < blobExchangeList.size(); i++) {
				PcDataExchange curBlobExchange = blobExchangeList.get(i);
				curBlobExchange.setXh(curXh + i);
				curBlobExchange.setPid(pid);
				curBlobExchange.setTxGroup(curTxGroup);
				exchangeList.add(curBlobExchange);
			}

			Map<String, String> retVal = dataExchangeService.sendExchangeData(exchangeList);
			String result = retVal.get("result");
//			dataExchangeService.addExchangeListToQueue(exchangeList);
//			String result = "success";
			if ( !result.equals("success") ){
				allSuccess = false;
				retMessage +=  unit.getUnitname() + ",";
			}
			
		}
		if ( allSuccess ){
			retMessage = "success";
			setSyncStatus(rootId, true);
		}
		else{
			retMessage = retMessage.substring(0, retMessage.length() - 1);
			retMessage += "发送失败";
		}
		return retMessage;

	}

	/**
	 * 判断是否为根节点（过滤掉岗位）
	 * 
	 * @param deptId
	 *            部门id
	 * @param posNo
	 *            岗位属性编码
	 * @return
	 */
	private boolean isLeaf(String deptId, String posNum, String type) {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(SgccIniUnit.class);
		criteria.add(Restrictions.eq("upunit", deptId));
		criteria.add(Restrictions.ne("unitTypeId", posNum));
		if (type.equals("prj")) {
			criteria.add((Restrictions.ne("unitTypeId", "8")));
		}
		criteria.setProjection(Projections.rowCount());
		Integer result = (Integer) comFileSortDeptDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);

		return result == 0;

	}

	public List<ComFileSortRightBean> getComFileSortRightTree(String nodeId,
			String rootId) {
		return getComFileSortRightTree(nodeId, rootId, false);
	}

	/**
	 * 从指定根节点开始获取节点权限树
	 * 
	 * @param nodeId
	 * @param rootId
	 * @return
	 */
	public List<ComFileSortRightBean> getComFileSortRightTree(String nodeId,
			String rootId, Boolean excludeDept) {

		List<ComFileSortRightBean> list = new ArrayList<ComFileSortRightBean>();

		// List<SgccIniUnit> unitList =
		// SgccIniUnitDAO.getInstence().findWhereOrderBy("unit_type_id <> '9'","view_order_num");
		// 获取岗位的类型编号
		String posNum = PropertyCodeDAO.getInstence()
				.getCodeValueByPropertyName("岗位", "组织机构类型");
		if (posNum == null) {
			posNum = "9";
		} else if (posNum.equals("")) {
			posNum = "9";
		}
		DetachedCriteria criteria = DetachedCriteria
				.forClass(SgccIniUnit.class);
		String sql = "unit_type_id <> '" + posNum + "'";
/*		if (excludeDept) {
			sql += " and unit_type_id <> '8'";
		}*/
		String DEPLOY_UNITTYPE = Constant.propsMap.get("DEPLOY_UNITTYPE");
		if(DEPLOY_UNITTYPE.equals("0")){//集团过滤外部单位
			String outDept="7";//外部单位类型为7
			sql+="	and unit_type_id <> '" + outDept + "'";			
		}
		sql += " start with unitid = '%s' connect by prior unitid = upunit order siblings by view_order_num";
		sql = String.format(sql, rootId);
		criteria.add(Restrictions.sqlRestriction(sql));

		List<SgccIniUnit> unitList = comFileSortDAO.getHibernateTemplate()
				.findByCriteria(criteria);

		for (int i = 0; i < unitList.size(); i++) {
			SgccIniUnit unit = unitList.get(i);
			ComFileSortRightBean bean = new ComFileSortRightBean();
			bean.setSortId(nodeId);
			bean.setUnitId(unit.getUnitid());
			bean.setUnitName(unit.getUnitname());
			bean.setUnitTypeId(unit.getUnitTypeId());
			bean.setParentUnitId(unit.getUpunit());
			if (unit.getLeaf() == 1) {
				bean.setLeaf(false);
			} else if (unit.getLeaf() == 0) {
				bean.setLeaf(true);
			}

			bean.setLeaf(isLeaf(unit.getUnitid(), posNum, excludeDept ? "prj"
					: "dept"));

			bean.setRead("false");
			bean.setWrite("false");
			List<ComFileSortDept> sortDeptList = this.comFileSortDeptDAO
					.findWhere("file_sort_id='" + nodeId + "' and dept_id = '"
							+ unit.getUnitid() + "'");
			if (sortDeptList.size() == 1
					&& sortDeptList.get(0).getRightLvl() != null) {
				String rightLvl = sortDeptList.get(0).getRightLvl();
				if (rightLvl.equals(FAPConstant.right_ReadOnly)) {
					bean.setRead("true");
					bean.setWrite("false");
				} else if (rightLvl.equals(FAPConstant.right_Write)) {
					bean.setRead("true");
					bean.setWrite("true");
				}
			}
			list.add(bean);
		}
		return list;
	}

	/**
	 * 设置移动后节点的排序号
	 * 
	 * @param sortList
	 * @param type
	 */
	private void setComFileSortTreeOrder(List<ComFileSort> sortList, String type) {
		if (sortList != null && sortList.size() > 0) {
			for (int i = 0; i < sortList.size(); i++) {
				ComFileSort hbm = sortList.get(i);
				Long order = type.equals("delete") ? hbm.getPxh() - 1 : hbm
						.getPxh() + 1;
				hbm.setPxh(order);
				ComFileSort parentHbm = (ComFileSort) this.comFileSortDAO
						.findById(hbm.getParentId());
				hbm.setPxhFull(this.getFullPxh(parentHbm.getPxhFull(), String
						.valueOf(order)));
				this.comFileSortDAO.saveOrUpdate(hbm);
			}
		}
	}

	/**
	 * 根据层次内的排序号生成全路径排序号
	 * 
	 * @param parentFullPxh
	 *            父节点的全路径排序号
	 * @param curPxh
	 *            当亲层次的排序号
	 * @return
	 */
	private String getFullPxh(String parentFullPxh, String curPxh) {
		int order = Integer.valueOf(curPxh);
		String orderStr = "000";
		if (order < 10) {
			orderStr = "00" + order;
		} else if (order < 100) {
			orderStr = "0" + order;
		} else {
			orderStr = String.valueOf(order);
		}
		orderStr = parentFullPxh + orderStr;
		return orderStr;
	}

	/**
	 * service私有方法，获取新的排序号
	 * 
	 * @param parentId
	 * @return
	 */
	private Map<String, String> getNewPxhForSortTree(String parentId) {
		Map<String, String> map = new HashMap<String, String>();
		try {
			String sql = "select nvl(max(pxh),0) as maxPxh from COM_FILE_SORT where parent_id='"
					+ parentId + "'";
			List list = JdbcUtil.query(sql);
			int order = 1;
			String orderStr = "001";
			if (list != null && list.size() > 0) {
				if (list.get(0) != null) {
					order = Integer.valueOf(((Map) list.get(0)).get("maxPxh")
							.toString()) + 1;
					ComFileSort cfs = (ComFileSort) comFileSortDAO
							.findById(parentId);
					if (cfs != null) {
						orderStr = this.getFullPxh(cfs.getPxhFull(), String
								.valueOf(order));
					}
				}
			}
			map.put("pxh", String.valueOf(order));
			map.put("pxhFull", orderStr);
			return map;
		} catch (Exception e) {
			log.error("生成新的排序号失败，具体原因：" + e.getMessage());
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 将字符串转换成sql语句中in所需要的字符串
	 * 
	 * @param oriStr
	 *            原始串
	 * @param spStr
	 *            分隔符
	 * @return 返回需要的串
	 */
	private String transStrForSqlIn(String oriStr, String spStr) {
		String rtnStr = "(";
		String[] oriStrArr = oriStr.split(spStr);
		for (int i = 0; i < oriStrArr.length; i++) {
			rtnStr += "'" + oriStrArr[i] + "',";
		}
		return rtnStr.substring(0, rtnStr.length() - 1) + ")";
	}
	/**
	 * 分类下发单位选择
	 * @param rootId
	 * @param userBelongUnitId	当前登录用户所属单位ID
	 * @param start
	 * @param limit
	 * @return
	 */	
	public List getIssueFileSortUnit(String rootId, String userBelongUnitId, Integer start,Integer limit) {
		String whereStr = "app_Url is not null and unitid in " +
			"( select dept_Id from Com_File_Sort_Dept dept where file_Sort_Id = '%s' and right_Lvl != 'None' ) " +
			"and unitid in (select unitid from Sgcc_Ini_Unit start with unitid = '" + userBelongUnitId + "' connect by prior unitid = upunit)";
		whereStr = String.format(whereStr, rootId);
		whereStr+=" and unit_Type_Id='3'";
		String sql = "select * from sgcc_ini_unit where " + whereStr ;
		
		SQLQuery query = HibernateSessionFactory.getSession().createSQLQuery(sql);
		int size = query.list().size();
		query.setFirstResult(start);
		query.setFetchSize(limit);
		query.addEntity(SgccIniUnit.class);
		
		List<SgccIniUnit> unitList = query.list();	
		if(unitList.size()>0){
			for(int i=0;i<unitList.size()-1;i++){
				SgccIniUnit sgccIniUnit=unitList.get(i);
				List<IssueFileSortUnit>issueFileSortUnitList=
					comFileSortDAO.findByWhere(IssueFileSortUnit.class.getName(), "sortid='"+rootId+"' and unitid='"+sgccIniUnit.getUnitid()+"'","pubtime desc");
				if(issueFileSortUnitList.size()>0){
					IssueFileSortUnit issueFileSortUnit=issueFileSortUnitList.get(0);
					sgccIniUnit.setState(String.valueOf(issueFileSortUnit.getStatus()));
				}else{
					sgccIniUnit.setState("0");
				}
				
			}
		}
		
		List returnList = new ArrayList();
		returnList.addAll(unitList);
		returnList.add(size);
		return returnList;
	}
	/*@param选择的下发单位
	 * @param unitids单位
	 * @param rootId
	 * @return
	 */	
	public String issueFileSortBySelect(String unitids[],String rootId){
		String whereStr = "1=1";
		if(unitids.length>0){
			String unitidsArr="";
			for(int i=0;i<unitids.length;i++){
				unitidsArr+="'"+unitids[i]+"'"+",";
			}
			unitidsArr=unitidsArr.substring(0,unitidsArr.length()-1);
			whereStr+="	 and unitid in ("+unitidsArr+")";
		}
		List<SgccIniUnit> unitList = comFileSortDAO.findByWhere(
				SgccIniUnit.class.getName(),
				whereStr);
		List<SgccIniUnit> sendUnitList = new ArrayList<SgccIniUnit>();
		List<String> urlTempList = new ArrayList<String>();
		
		for (SgccIniUnit unit : unitList) {
			if (urlTempList.contains(unit.getAppUrl())) {
				continue;
			}
			sendUnitList.add(unit);
			urlTempList.add(unit.getAppUrl());
		}
		
		// 记录包括3张表com_file_sort, sgcc_attach_list,
		// sgcc_attach_blob
		List<ComFileSort> sortList;
		List<SgccAttachList> attachList = new ArrayList<SgccAttachList>();
		
		// 取得文件分类列表
		DetachedCriteria criteria = DetachedCriteria
				.forClass(ComFileSort.class);
		String sql = String
				.format(
						"1 = 1 start with uids = '%s' connect by prior uids = parent_id ",
						rootId);
		criteria.add(Restrictions.sqlRestriction(sql));
		
		sortList = comFileSortDAO.getHibernateTemplate().findByCriteria(
				criteria);
		
		// 找到所有分类对应的模板记录
		for (ComFileSort fileSort : sortList) {
		
			// attachList 列表
			List<SgccAttachList> attachTempList = comFileSortDAO.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type = 'FAPTemplate' and transaction_id ='"
							+ fileSort.getUids() + "'");
		
			attachList.addAll(attachTempList);
		}
		
		List allDataList = new ArrayList();
		allDataList.addAll(sortList);
		allDataList.addAll(attachList);
		
		String beforeSql = "delete from sgcc_attach_blob t where t.file_lsh in ( select t2.file_lsh from sgcc_attach_list t2 where t2.transaction_type = 'FAPTemplate' and t2.transaction_id in ( select uids from com_file_sort t3 start with t3.parent_id = '"
				+ rootId + "' connect by prior uids = parent_id ) );";
		beforeSql += "delete from sgcc_attach_list t where t.transaction_type = 'FAPTemplate' and t.transaction_id in ( select uids from com_file_sort t2 start with t2.parent_id = '"
				+ rootId + "' connect by prior uids = parent_id );";
		beforeSql += "delete from com_file_sort t where t.uids in ( select uids from com_file_sort t2 start with t2.parent_id = '"
				+ rootId + "' connect by prior uids = parent_id)";
		
		String afterSql = "delete from com_file_sort_dept t where t.file_sort_id not in " +
				"( select uids from com_file_sort )";
		
		PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");
		
		String retMessage = "";
		boolean allSuccess = true;
		for (SgccIniUnit unit : sendUnitList) {
			String pid = unit.getUnitid();
			//不先清空分类，直接覆盖 
			List<PcDataExchange> exchangeList = dataExchangeService
					.getExcDataList(allDataList, pid,Constant.DefaultOrgRootID, null, afterSql,"下发文件分类");
		
			List<PcDataExchange> blobExchangeList = new ArrayList<PcDataExchange>();
			// 手动生成所有attachBlob的dataExchange记录
			for (SgccAttachList attach : attachList) {
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("SGCC_ATTACH_BLOB");
				exchange.setBlobCol("FILE_NR");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("FILE_LSH", attach.getFileLsh());
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				// // 判断数据是否已经存在于报送队列
				// List lt = comFileSortDAO.findByWhere(
				// PcDataExchange.class.getName(),
				// "tableName='SGCC_ATTACH_BLOB' and keyValue='"
				// + exchange.getKeyValue() + "'");
				// if (lt.size() > 0) {
				// comFileSortDAO.deleteAll(lt);
				// }
				blobExchangeList.add(exchange);
			}
		
			// for (PcDataExchange pcDataExchange : exchangeList) {
			// comFileSortDAO.saveOrUpdate(pcDataExchange);
			// }
			// 再将生成的attach_blob记录添加到队列中
			// 当前的xh, tx_group
			PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
			Long curXh = tempExc.getXh() + 1;
			String curTxGroup = tempExc.getTxGroup();
			
			for (int i = 0; i < blobExchangeList.size(); i++) {
				PcDataExchange curBlobExchange = blobExchangeList.get(i);
				curBlobExchange.setXh(curXh + i);
				curBlobExchange.setPid(pid);
				curBlobExchange.setTxGroup(curTxGroup);
				exchangeList.add(curBlobExchange);
			}
		
			Map<String, String> retVal = dataExchangeService.sendExchangeData(exchangeList);
			String result = retVal.get("result");
		//	dataExchangeService.addExchangeListToQueue(exchangeList);
		//	String result = "success";
			if ( !result.equals("success") ){
				allSuccess = false;
				retMessage +=  unit.getUnitname() + ",";
			}
	
}
if ( allSuccess ){
	//下发成功,保存下发单位到下发单位表中
	if(unitids.length>0){
		Date thisDate = new Date();
		for(int i=0;i<unitids.length;i++){
			IssueFileSortUnit issueFileSortUnit=new IssueFileSortUnit();
			issueFileSortUnit.setSortid(rootId);
			issueFileSortUnit.setUnitid(unitids[i]);
			issueFileSortUnit.setStatus(Long.parseLong("1"));
			issueFileSortUnit.setPubtime(thisDate);
			comFileSortDAO.insert(issueFileSortUnit);
		}
	}
	retMessage = "success";
	setSyncStatus(rootId, true);
}
else{
	retMessage = retMessage.substring(0, retMessage.length() - 1);
	retMessage += "发送失败";
}
return retMessage;		
	}
	/* get and set method */

	public ComFileSortDAO getComFileSortDAO() {
		return comFileSortDAO;
	}

	public void setComFileSortDAO(ComFileSortDAO comFileSortDAO) {
		this.comFileSortDAO = comFileSortDAO;
	}

	public ComFileSortDeptDAO getComFileSortDeptDAO() {
		return comFileSortDeptDAO;
	}

	public void setComFileSortDeptDAO(ComFileSortDeptDAO comFileSortDeptDAO) {
		this.comFileSortDeptDAO = comFileSortDeptDAO;
	}



}
