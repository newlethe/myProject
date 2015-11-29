package com.sgepit.pmis.gczl.service;

import java.io.IOException;
import java.io.StringReader;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.naming.NamingException;

import net.sf.json.JSONObject;

import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.gczl.dao.GczlDAO;
import com.sgepit.pmis.gczl.hbm.GczlJyDetail;
import com.sgepit.pmis.gczl.hbm.GczlJyDetailView;
import com.sgepit.pmis.gczl.hbm.GczlJyStat;
import com.sgepit.pmis.gczl.hbm.GczlJyxm;
import com.sgepit.pmis.gczl.hbm.GczlJyxmApproval;

public class GczlYpMgmImpl implements GczlYpMgmFacade {
	private String[][] yearMonthArr = { { "201001", "2010年1月" },
			{ "201002", "2010年2月" }, { "201003", "2010年3月" },
			{ "201004", "2010年4月" }, { "201005", "2010年5月" },
			{ "201006", "2010年6月" }, { "201007", "2010年7月" },
			{ "201008", "2010年8月" }, { "201009", "2010年9月" },
			{ "201010", "2010年10月" }, { "201011", "2010年11月" },
			{ "201012", "2010年12月" }, { "201101", "2011年1月" },
			{ "201102", "2011年2月" }, { "201103", "2011年3月" },
			{ "201104", "2011年4月" }, { "201105", "2011年5月" },
			{ "201106", "2011年6月" }, { "201107", "2011年7月" },
			{ "201108", "2011年8月" }, { "201109", "2011年9月" },
			{ "201110", "2011年10月" }, { "201111", "2011年11月" },
			{ "201112", "2011年12月" } };

	private static final String ROOT_XMBH = "1";

	private GczlDAO gczlDAO;

	private String makeSjTypeString(String[][] arr) {
		String retStr = "[";
		for (int i = 0; i < arr.length; i++) {
			retStr += String.format("['%s','%s']", arr[i][0], arr[i][1]);
			if (i < arr.length - 1) {
				retStr += ",";
			}
		}
		retStr += "]";

		return retStr;
	}

	public String getYearMonthArrStr() {
		return makeSjTypeString(yearMonthArr);
	}

	public String getSjTypeForDept(String deptId) {
		// 找到已存在的sjType
		String hql = "select sjType from GczlJyStat t where t.deptId='"
				+ deptId + "'";
		List<String> sjList = gczlDAO.findByHql(hql);
		List<String[]> availableSjType = new ArrayList<String[]>();
		for (String[] str : yearMonthArr) {
			if (!sjList.contains(str[0])) {
				availableSjType.add(str);
			}
		}
		String retStr = "[";
		for (int i = 0; i < availableSjType.size(); i++) {
			retStr += String.format("['%s','%s']", availableSjType.get(i)[0],
					availableSjType.get(i)[1]);
			if (i < availableSjType.size() - 1) {
				retStr += ",";
			}
		}
		retStr += "]";

		return retStr;
	}

	public String getGczlYpDetailXml(String statId) {
		String xmlStr = "";
		xmlStr += "<rows>";
		xmlStr += "<head>";
		xmlStr += "<column id=\"xmmc\" width=\"240\" type=\"tree\" align=\"left\" sort=\"str\">已开工单位工程名称</column>";
		xmlStr += "<column id=\"jy_detail_id\" width=\"100\" type=\"ro\" align=\"left\" sort=\"str\" hidden=\"true\">jy_detail_id</column>";
		xmlStr += "<column id=\"jy_stat_id\" width=\"10\" type=\"ro\" align =\"left\" sort=\"str\" hidden=\"true\">jy_stat_id</column>";
		xmlStr += "<column id=\"jyp\" width=\"80\" type=\"edn[=sum]\" align =\"right\" sort=\"str\" format=\"0.00\" >检验批</column>";
		xmlStr += "<column id=\"sum_jyp\" width=\"80\" type=\"ron\" align =\"right\" sort=\"str\" format=\"0.00\" >#cspan</column>";
		xmlStr += "<column id=\"fx_prj\" width=\"80\" type=\"edn[=sum]\" align =\"right\" sort=\"str\" format=\"0.00\" >分项工程</column>";
		xmlStr += "<column id=\"sum_fx_prj\" width=\"80\" type=\"ron\" align =\"right\" sort=\"str\" format=\"0.00\" >#cspan</column>";
		xmlStr += "<column id=\"zfb_prj\" width=\"80\" type=\"edn[=sum]\" align =\"right\" sort=\"str\" format=\"0.00\" >子分部工程</column>";
		xmlStr += "<column id=\"sum_zfb_prj\" width=\"80\" type=\"ron\" align =\"right\" sort=\"str\" format=\"0.00\" >#cspan</column>";
		xmlStr += "<column id=\"fb_prj\" width=\"80\" type=\"edn[=sum]\" align =\"right\" sort=\"str\" format=\"0.00\" >分部工程</column>";
		xmlStr += "<column id=\"sum_fb_prj\" width=\"80\" type=\"ron\" align =\"right\" sort=\"str\" format=\"0.00\" >#cspan</column>";
		xmlStr += "<column id=\"zdw_prj\" width=\"80\" type=\"edn[=sum]\" align =\"right\" sort=\"str\" format=\"0.00\" >子单位工程</column>";
		xmlStr += "<column id=\"sum_zdw_prj\" width=\"80\" type=\"ron\" align =\"right\" sort=\"str\" format=\"0.00\" >#cspan</column>";
		xmlStr += "<column id=\"prj_pd\" width=\"80\" type=\"edtxt\" align =\"left\" sort=\"str\" >单位工程评定</column>";
		xmlStr += "<afterInit><call command=\"attachHeader\"><param>#rspan,#rspan,#rspan,本月,累计,本月,累计,本月,累计,本月,累计,本月,累计,#rspan</param></call>	</afterInit>";
		xmlStr += "</head>";
		xmlStr += getChildJyDetailXmlStr(statId, ROOT_XMBH);
		xmlStr += "</rows>";
		return xmlStr;
	}

	private String getChildJyDetailXmlStr(String jyStatId, String xmbh) {
		String returnStr = "";
		GczlJyDetailView jyDetailView;
		List<GczlJyDetailView> curList = gczlDAO.findByWhere(
				GczlJyDetailView.class.getName(), "jy_stat_id = '" + jyStatId
						+ "' and jyxm_bh = '" + xmbh + "'");

		if (curList.size() == 0)
			return "";
		jyDetailView = curList.get(0);
		returnStr += String.format("<row id='%s' open='1'>", jyDetailView
				.getJyDetailId());
		returnStr += String.format("<cell>%s</cell>", jyDetailView.getXmmc());

		// 得到子节点集合
		String subNodeSql = "select jyxm_bh from viw_gczl_jy_detail where jy_stat_id = '"
				+ jyStatId + "' and parent_bh='" + xmbh + "' order by jyxm_bh";
		List<Map<String, String>> childList = JdbcUtil.query(subNodeSql);

		for (Map<String, String> childMap : childList) {
			returnStr += getChildJyDetailXmlStr(jyStatId, childMap
					.get("jyxm_bh"));
		}

		boolean isLeaf = childList.isEmpty();

		// 添加单行数据
		// returnStr += String.format("<cell>%s</cell>",
		// jyDetailView.getXmmc());
		returnStr += String.format("<cell>%s</cell>", jyDetailView
				.getJyDetailId());
		returnStr += String.format("<cell>%s</cell>", jyDetailView
				.getJyStatId());
		returnStr += isLeaf ? String.format("<cell>%.4f</cell>", jyDetailView
				.getJyp()) : "<cell></cell>";
		returnStr += String.format("<cell>%.4f</cell>", jyDetailView
				.getSumJyp());
		returnStr += isLeaf ? String.format("<cell>%.4f</cell>", jyDetailView
				.getFxPrj()) : "<cell></cell>";
		returnStr += String.format("<cell>%.4f</cell>", jyDetailView
				.getSumFxPrj());
		returnStr += isLeaf ? String.format("<cell>%.4f</cell>", jyDetailView
				.getZfbPrj()) : "<cell></cell>";
		returnStr += String.format("<cell>%.4f</cell>", jyDetailView
				.getSumZfbPrj());
		returnStr += isLeaf ? String.format("<cell>%.4f</cell>", jyDetailView
				.getFbPrj()) : "<cell></cell>";
		returnStr += String.format("<cell>%.4f</cell>", jyDetailView
				.getSumFbPrj());
		returnStr += isLeaf ? String.format("<cell>%.4f</cell>", jyDetailView
				.getZdwPrj()) : "<cell></cell>";
		returnStr += String.format("<cell>%.4f</cell>", jyDetailView
				.getSumZdwPrj());
		returnStr += String.format("<cell>%s</cell>",
				jyDetailView.getPrjPd() == null ? "" : jyDetailView.getPrjPd());

		returnStr += "</row>";

		return returnStr;
	}

	public Boolean checkSjTypeAvailable(String sjType, String deptId) {

		List gczlJyList = gczlDAO.findByWhere(GczlJyStat.class.getName(),
				"dept_id = '" + deptId + "' and sj_type='" + sjType + "'");

		return gczlJyList.size() == 0;
	}

	public void updateYpStatDetailData(String statId, String dataXML)
			throws JDOMException, IOException, NamingException, SQLException {
		SAXBuilder parser = new SAXBuilder();
		Document doc = parser.build(new StringReader(dataXML));

		Element root = doc.getRootElement();
		List<Element> updateRows = XPath.selectNodes(root,
				"/rows/row[@type='update']");
		List<Element> deleteRows = XPath.selectNodes(root,
				"/rows/row[@type='delete']");

		// 更新行
		for (Element element : updateRows) {
			// 节点id
			String jyDetailId = element.getAttributeValue("id");
			// 检验批
			Double jyp = 0d;
			List<Element> jypList = XPath.selectNodes(element,
					"cell[@colname='jyp']");
			if (jypList.size() > 0) {
				jyp = convertToDouble(jypList.get(0).getTextTrim());
			}

			// 分项工程
			Double fxPrj = 0d;
			List<Element> fxList = XPath.selectNodes(element,
					"cell[@colname='fx_prj']");
			if (fxList.size() > 0) {
				fxPrj = convertToDouble(fxList.get(0).getTextTrim());
			}

			// 子分部工程
			Double zfbPrj = 0d;
			List<Element> zfbList = XPath.selectNodes(element,
					"cell[@colname='zfb_prj']");
			if (zfbList.size() > 0) {
				zfbPrj = convertToDouble(zfbList.get(0).getTextTrim());
			}

			// 分部工程
			Double fbPrj = 0d;
			List<Element> fbList = XPath.selectNodes(element,
					"cell[@colname='fb_prj']");
			if (fbList.size() > 0) {
				fbPrj = convertToDouble(fbList.get(0).getTextTrim());
			}

			// 子单位工程
			Double zdwPrj = 0d;
			List<Element> zdwList = XPath.selectNodes(element,
					"cell[@colname='zdw_prj']");
			if (zdwList.size() > 0) {
				zdwPrj = convertToDouble(zdwList.get(0).getTextTrim());
			}

			// 单位工程评定
			String prjPd = "";
			List<Element> pdList = XPath.selectNodes(element,
					"cell[@colname='prj_pd']");
			if (pdList.size() > 0) {
				prjPd = pdList.get(0).getText();
			}

			String hql = "update GczlJyDetail t";
			hql += " set t.jyp = " + jyp;
			hql += ", t.fxPrj = " + fxPrj;
			hql += ", t.zfbPrj = " + zfbPrj;
			hql += ", t.fbPrj = " + fbPrj;
			hql += ", t.zdwPrj = " + zdwPrj;
			hql += ", t.prjPd = '" + prjPd + "'";
			hql += " where t.jyDetailId = '" + jyDetailId + "'";

			gczlDAO.executeHQL(hql);
		}

		// 删除行
		for (Element delElement : deleteRows) {
			// 节点id
			String jyDetailId = delElement.getAttributeValue("id");

			Object jyObj = gczlDAO.findById(GczlJyDetail.class.getName(),
					jyDetailId);

			if (jyObj != null) {
				GczlJyDetail jyDetail = (GczlJyDetail) jyObj;
				deleteZlypDetailNode(jyDetailId);

				clearEmptyParent(jyDetail.getJyStatId(), jyDetail.getParentBh());

				recalNodeMoney(jyDetail.getJyStatId(), jyDetail.getParentBh());
			}

		}

	}

	private Double convertToDouble(String str) {
		if (str.equals(""))
			return 0d;
		else
			return Double.valueOf(str);
	}

	public String getUnitArrStr() {
		List<SgccIniUnit> unitList = gczlDAO.findByWhere(
				"com.sgepit.frame.sysman.hbm.SgccIniUnit",
				"upunit = '" + Constant.DefaultOrgRootID + "' or unitid = '" + Constant.DefaultOrgRootID + "'");
		String retStr = "[";
		for (int i = 0; i < unitList.size(); i++) {
			SgccIniUnit unit = unitList.get(i);
			retStr += String.format("['%s','%s']", unit.getUnitid(), unit
					.getUnitname());
			if (i < unitList.size() - 1) {
				retStr += ",";
			}
		}
		retStr += "]";

		return retStr;
	}

	/**
	 * 向验评统计报表里增加单位工程
	 * 
	 * @param jyxmIds
	 * @param statId
	 */
	public void addNodesToZlypStat(String[] jyxmBhs, String statId) {
		// 获取主表对象
		Object mainObj = gczlDAO.findBeanByProperty(GczlJyStat.class.getName(),
				"uids", statId);
		if (mainObj == null)
			return;

		GczlJyStat mainStat = (GczlJyStat) mainObj;
		DateFormat format = new SimpleDateFormat("yyyyMM");
		Date detailDate;
		try {
			detailDate = format.parse(mainStat.getSjType());
		} catch (Exception e) {
			throw new BusinessException("主表编制时间格式不正确");
		}
		for (String jyxmBh : jyxmBhs) {
			// 若报表中已存在则不添加
			List list = gczlDAO.findByWhere(GczlJyDetail.class.getName(),
					"jy_stat_id = '" + statId + "' and jyxm_bh = '" + jyxmBh
							+ "'");
			if (list.size() > 0) {
				continue;
			}

			GczlJyxm jyxm;
			try {
				// 找到当前项目节点
				jyxm = (GczlJyxm) gczlDAO.findByWhere(GczlJyxm.class.getName(),
						"xmbh = '" + jyxmBh + "'").get(0);

			} catch (Exception e) {
				throw new BusinessException("所选的单位项目节点不存在");
			}

			// 添加新节点
			GczlJyDetail jyDetail = new GczlJyDetail();
			jyDetail.setJyStatId(statId);
			jyDetail.setJyxmBh(jyxmBh);
			jyDetail.setParentBh(jyxm.getParentbh());
			jyDetail.setJyDetailDate(detailDate);

			gczlDAO.saveOrUpdate(jyDetail);

		}
	}

	/**
	 * 删除质量验评报表中的节点
	 * 
	 * @param nodeId
	 *            节点id
	 */
	private void deleteZlypDetailNode(String nodeId) {
		Object jyObj = gczlDAO.findById(GczlJyDetail.class.getName(), nodeId);

		if (jyObj != null) {
			GczlJyDetail jyDetail = (GczlJyDetail) jyObj;

			// 若有子节点则先删除
			List<GczlJyDetail> childList = gczlDAO.findByWhere(
					GczlJyDetail.class.getName(), "jy_stat_id = '"
							+ jyDetail.getJyStatId() + "' and parent_bh = '"
							+ jyDetail.getJyxmBh() + "'");
			if (childList.size() > 0) {
				for (GczlJyDetail child : childList) {
					deleteZlypDetailNode(child.getJyDetailId());
				}
			}

			gczlDAO.delete(jyDetail);

		}

	}

	/**
	 * 清除已不存在子项目的父节点
	 * 
	 * @param nodeId
	 */
	private void clearEmptyParent(String statId, String jyxmBh) {
		List<GczlJyDetail> jyObj = gczlDAO.findByWhere(GczlJyDetail.class
				.getName(), "jy_stat_id = '" + statId + "' and jyxm_bh = '"
				+ jyxmBh + "'");

		if (jyObj.size() > 0) {
			GczlJyDetail jyDetail = jyObj.get(0);
			DetachedCriteria criteria = DetachedCriteria
					.forClass(GczlJyDetail.class);
			criteria.add(Restrictions.eq("parentBh", jyxmBh));
			criteria.add(Restrictions.eq("jyStatId", statId));
			criteria.setProjection(Projections.rowCount());
			Integer result = (Integer) gczlDAO.getHibernateTemplate()
					.findByCriteria(criteria, 0, 1).get(0);

			if (result == 0) {
				gczlDAO.delete(jyDetail);
				if (!jyDetail.getJyxmBh().equals(ROOT_XMBH)) {
					clearEmptyParent(jyDetail.getJyStatId(), jyDetail
							.getParentBh());
				}
			}

		}

	}

	private void recalNodeMoney(String statId, String jyxmBh) {
		String hql = "update GczlJyDetail t";
		hql += " set t.jyp = ( select sum(jyp) from GczlJyDetail t2 where t2.jyStatId = '"
				+ statId + "' and t2.parentBh='" + jyxmBh + "')";
		hql += ", t.fxPrj = ( select sum(fxPrj) from GczlJyDetail t3 where t3.jyStatId = '"
				+ statId + "' and t3.parentBh='" + jyxmBh + "')";
		hql += ", t.zfbPrj = ( select sum(zfbPrj) from GczlJyDetail t4 where t4.jyStatId = '"
				+ statId + "' and t4.parentBh='" + jyxmBh + "')";
		hql += ", t.fbPrj = ( select sum(fbPrj) from GczlJyDetail t5 where t5.jyStatId = '"
				+ statId + "' and t5.parentBh='" + jyxmBh + "')";
		hql += ", t.zdwPrj = ( select sum(zdwPrj) from GczlJyDetail t6 where t6.jyStatId = '"
				+ statId + "' and t6.parentBh='" + jyxmBh + "')";
		hql += " where t.jyStatId='" + statId + "' and t.jyxmBh='" + jyxmBh
				+ "'";

		gczlDAO.executeHQL(hql);

		List<GczlJyDetail> jyObj = gczlDAO.findByWhere(GczlJyDetail.class
				.getName(), "jy_stat_id = '" + statId + "' and jyxm_bh = '"
				+ jyxmBh + "'");

		if (jyObj.size() > 0) {
			GczlJyDetail jyDetail = jyObj.get(0);
			if (!jyDetail.getJyxmBh().equals(ROOT_XMBH)) {
				recalNodeMoney(jyDetail.getJyStatId(), jyDetail.getParentBh());
			}
		}

	}

	/**
	 * 显示添加工程项目树
	 * 
	 * @param statId
	 *            验评主表id
	 * @param parentId
	 *            父节点id
	 * @return
	 */
	public List<ColumnTreeNode> getSelectDwPrjTree(String statId,
			String parentId) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		// 得到“单位工程”的属性id
		String dwPrjPropId;
		List<PropertyCode> propertyList = gczlDAO.findByProperty(
				PropertyCode.class.getName(), "propertyName", "单位工程");
		if (propertyList.size() > 0) {
			dwPrjPropId = propertyList.get(0).getPropertyCode();
		} else {
			dwPrjPropId = "1";
		}

		// 默认根节点“验评标准树”
		if (parentId == null) {
			parentId = ROOT_XMBH;
		} else if (parentId.equals("")) {
			parentId = ROOT_XMBH;
		}

		String whereStr = "parentbh='" + parentId + "' order by xmbh";

		List<GczlJyxm> jyxmList = gczlDAO.findByWhere(GczlJyxm.class.getName(),
				whereStr);
		for (GczlJyxm jyxm : jyxmList) {
			ColumnTreeNode columnTreeNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			// 到了"单位工程"，即是根节点
			boolean leaf = false;
			if (jyxm.getGcType() != null) {
				if (jyxm.getGcType().equals(dwPrjPropId)) {
					leaf = true;
				}
			}
			if (leaf) {
				node.setLeaf(true);
				node.setIconCls("task");
			} else {
				node.setLeaf(false); // treenode.leaf
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			columnTreeNode.setTreenode(node);
			JSONObject jo = JSONObject.fromObject(jyxm);

			// UIProvider
			String uiProvider = "col";

			if (leaf) {
				List<GczlJyDetail> curList = gczlDAO.findByWhere(
						GczlJyDetail.class.getName(), "jy_stat_id = '" + statId
								+ "' and jyxm_bh = '" + jyxm.getXmbh() + "'");
				if (curList.size() > 0) {
					jo.accumulate("disabled", true);
					uiProvider = "plain";
				}
			}
			jo.accumulate("uiProvider", uiProvider);
			columnTreeNode.setColumns(jo); // columns
			list.add(columnTreeNode);
		}

		return list;
	}

	public void setGczlDAO(GczlDAO gczlDAO) {
		this.gczlDAO = gczlDAO;
	}

	public void saveOrUpdate(GczlJyStat[] jyStats) throws BusinessException {

		for (GczlJyStat gczlJyStat : jyStats) {
			gczlDAO.saveOrUpdate(gczlJyStat);
		}

	}

	/**
	 * 删除质量验评表（主表）及其对应的报表信息
	 * 
	 * @param statId
	 */
	public void deleteZlypStat(String statId) throws BusinessException {
		if (checkZlypDeletable(statId)) {
			// 删除报表信息

			String hql = "delete from GczlJyDetail t where t.jyStatId = '"
					+ statId + "'";
			gczlDAO.executeHQL(hql);

			// 删除主表信息
			Object gczlJyObj = gczlDAO.findById(GczlJyStat.class.getName(),
					statId);
			if (gczlJyObj != null) {
				gczlDAO.delete(gczlJyObj);
			}

		}
	}

	/**
	 * 判断质量验评主表是否可以删除
	 * 
	 * @param statId
	 * @return
	 */
	private boolean checkZlypDeletable(String statId) {
		// TODO 业务逻辑未完成
		return true;
	}

	public String getNewGczlStatUids(String userId, String deptId) {
		String retVal = "";
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		retVal = deptId + userId + dateFormat.format(new Date());
		String hql = "select (uids) from GczlJyStat t where t.uids = '"
				+ retVal + "'";
		if (gczlDAO.findByHql(hql).size() > 0) {
			retVal = UUID.randomUUID().toString();
		}

		return retVal;
	}
	/**
	 * 验评记录管理
	 * @param pid	项目ID
	 * @param xmbh	检验项目代码
	 * @param start	起始
	 * @param limit	数量
	 * @param where	其余条件
	 * @author shangtw
	 */
	public List getGczlApproval(String pid, String xmbh,Integer start,Integer limit,String where) {
		Session s = null;
		List l = null;
		int size = 0;
		//'1'表示根节点，进入页面时显示全部，选择节点后，显示此节点及其所有子节点下的数据
		String sql= xmbh.equals("1") ?
				"select gjmb.uids as jymbUids,gjmb.mbname as mbname,gjmb.filedate,gjmb.fileid,gjmb.filesize,gjmb.fileuser,gjmb.JYXM_BH as jyxmBh, gjmb.JYXM_UIDS as jyxmUids," +
				"gjxmal.* from gczl_jyxm gjxm,gczl_jymb gjmb,gczl_jyxm_approval gjxmal where gjxm.pid='" + pid + "' and gjmb.pid='" + pid + "' and gjxmal.pid='" + pid + 
				"' and gjxm.uids(+)=gjmb.jyxm_uids and gjmb.uids=gjxmal.jymb_uids and "+where
				:
				"select gjmb.uids as jymbUids,gjmb.mbname as mbname,gjmb.filedate,gjmb.fileid,gjmb.filesize,gjmb.fileuser,gjmb.JYXM_BH as jyxmBh, gjmb.JYXM_UIDS as jyxmUids," +
				"gjxmal.* from gczl_jyxm gjxm,gczl_jymb gjmb,gczl_jyxm_approval gjxmal where gjxm.xmbh in (select m.xmbh from GCZL_JYXM m connect by prior m.uids = m.parentbh" +
				" start with m.xmbh = '" + xmbh + "') and gjxm.pid='" + pid + "' and gjmb.pid='" + pid + "' and gjxmal.pid='" + pid +
				"' and gjxm.uids(+)=gjmb.jyxm_uids and gjmb.uids=gjxmal.jymb_uids and "+where;
		try {
			s = HibernateSessionFactory.getSession();
			SQLQuery q = s.createSQLQuery(sql)
			.addScalar("jymbUids", Hibernate.STRING)
			.addScalar("mbname", Hibernate.STRING)
			.addScalar("filedate", Hibernate.DATE)
			.addScalar("fileid", Hibernate.STRING)
			.addScalar("filesize", Hibernate.LONG)
			.addScalar("fileuser", Hibernate.STRING)
			.addScalar("jyxmBh", Hibernate.STRING)
			.addScalar("jyxmUids", Hibernate.STRING)
			.addScalar("uids", Hibernate.STRING)
			.addScalar("pid", Hibernate.STRING)
			.addScalar("grade", Hibernate.STRING)
			.addScalar("result", Hibernate.STRING)
			.addScalar("checkdate", Hibernate.DATE)
			.addScalar("approval_status", Hibernate.STRING)
			.addScalar("approval_result", Hibernate.STRING)
			.addScalar("remark", Hibernate.STRING);
			size = q.list().size();
			q.setFirstResult(start);
			q.setMaxResults(limit);
			l = q.list();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			s.close();
			}	
		List returnList = new ArrayList();
		if(size>0){
			for (int i = 0; i <l.size(); i++) {
				GczlJyxmApproval vo = new GczlJyxmApproval();
				Object[] objs = (Object[]) l.get(i);
				vo.setJymbUids((String)objs[0]);
				vo.setMbname((String)objs[1]);
				vo.setFiledate((Date)objs[2]);
				vo.setFileid((String)objs[3]);
				vo.setFilesize((Long)objs[4]);
				vo.setFileuser((String)objs[5]);
				vo.setJyxmBh((String)objs[6]);	
				vo.setJyxmUids((String)objs[7]);
				vo.setUids((String)objs[8]);
				vo.setPid((String)objs[9]);
				vo.setGrade((String)objs[10]);
				vo.setResult((String)objs[11]);
				vo.setCheckDate((Date)objs[12]);
				vo.setApprovalStatus((String)objs[13]);
				vo.setApprovalResult((String)objs[14]);
				vo.setRemark((String)objs[15]);
				returnList.add(vo);
			}
		}
		returnList.add(size);	
		return 	returnList;
	}
}
