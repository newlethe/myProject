package com.sgepit.pmis.finalAccounts.complete.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Workbook;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.equipment.hbm.EquGoodsBodys;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompFixedAssetList;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompFixedAssetTree;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedAsset;

public interface FAFixedAssetService {

	/**
	 * 构造固定资产分类树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 * @author zhangh 2013-06-26
	 */
	public List<ColumnTreeNode> getFACompFixedAssetTree(String orderBy,
			Integer start, Integer limit, HashMap map);
	
	
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
	public String getNewTreeid(String pid, String prefix, String col,
			String table, Long lsh);
	
	
	/**
	 * 保存固定资产分类
	 * @param assetTree
	 * @return
	 * @author zhangh 2013-06-27
	 */
	public String saveOrUpdateFACompFixedAssetTree(FACompFixedAssetTree assetTree);
	
	
	/**
	 * 删除固定资产分类
	 * @param uids
	 * @return
	 * @author zhangh 2013-06-27
	 */
	public String deleteFACompFixedAssetTree(String uids);
	
	
	/**
	 * 判断固定资产分类节点是否有关联固定资产
	 * @param uids
	 * @return
	 * @author zhangh 2013-06-27
	 */
	public String treeHasFACompFixedAsset(String uids);
	
	
	/**
	 * 构造colmuntree
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException;
	
	
	/**
	 * 保存固定资产
	 * @param assetList
	 * @return
	 * @author zhangh 2013-07-01
	 */
	public String saveOrUpdateFACompFixedAssetList(FACompFixedAssetList assetList);
	
	
	/**
	 * 删除固定资产
	 * @param uids
	 * @return
	 * @author zhangh 2013-07-01
	 */
	public String deleteFACompFixedAssetList(String uids);
	
	
	/**
	 * 判断固定资产清单节点是否有关联固定资产
	 * @param uids
	 * @return
	 * @author zhangh 2013-07-01
	 */
	public String listHasFACompFixedAsset(String uids);
	
	
	/**
	 * 保存或修改固定资产清单
	 * @param fixedAsset
	 * @return
	 * @author zhangh 2013-07-10
	 */
	public String saveOrUpdateFACompFixedAsset(FacompFixedAsset fixedAsset);
	
	
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
	public List<ColumnTreeNode> buildFacompFixedBdgProjectViewTree(String orderBy, Integer start,
			Integer limit, HashMap map) throws BusinessException;
	
	
	/**
	 * 建筑工程-工程量 选择合同后，初始化所属工程量和金额
	 * @param fixeduids
	 * @param conid
	 * @author zhangh 2013-07-17
	 */
	public void initFacompFixedAssetBdgNum(String fixeduids, String conid, String bdgidtype);
	
	
	/**
	 * 建筑工程-材料 选择合同后，初始化使用数量和使用金额
	 * @param fixeduids
	 * @param conid
	 * @author zhangh 2013-07-19
	 */
	public void initFacompFixedAssetWzoutNum(String fixeduids, String conid, String bdgidtype);
	
	/**
	 * 保存所选的设备购置费，并更新总金额到固定资产
	 * @param fixeduids
	 * @param selectConid
	 * @param recArr
	 * @return
	 * @author zhengh 2013-07-23
	 */
	public String updateFacompFixedAssetSbbodysNum(String fixeduids,String selectConid,EquGoodsBodys[] recArr);
	
	/**
	 * 库存资产管理信息初始化
	 * @param obj
	 * @return
	 * yanglh 2013-07-25
	 */
	
	public String insertFromKcToFacompEquWzBmInv(String pid);
	
	/**
	 * 先查询出当前概算，固定资产清单的工程量叶子节点，然后找出他们的父节点，再对父节点的工程量、金额做统计
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 * @throws BusinessException
	 * @author pengy 2013-08-19
	 */
	public List<ColumnTreeNode> buildFacompAssetListReportViewTree(String orderBy, Integer start,
 Integer limit, HashMap map) throws BusinessException;

	/**
	 * 主体设备正式出库，出库单完结时，将出库明细添加到固定资产清单树对应的节点下
	 * @param pid	项目Id
	 * @param equid	仓库编码
	 * @param outId	出库单主键
	 * @param getUsing 领料用途，概算
	 * @param equOrCl 设备或材料
	 * @author pengy 2013-10-08
	 */
	public String addFACompFixedAssetList(String pid, String equid, String outId, String getUsing, String equOrCl);

	/**
	 * 固定资产信息初始化，对所有数据的建筑、安装、设备、其他费用字段值重新获取一次
	 * @param pid 项目ID
	 * @return true成功，false失败
	 */
	public boolean initFixedAsset(String pid);

	/**
	 * 初始化土建（包含房屋建筑物、构筑物、设备基座、管线）资产信息
	 * @param pid 项目id
	 * @return 初始化成功的信息条数
	 */
	public String initTjAsset(String pid);

	/**
	 * 删除土建（包含房屋建筑物、构筑物、设备基座、管线）资产信息
	 * @param pid 项目id
	 * @return 删除成功的信息条数
	 * @author pengy
	 * @createDate 2014-03-19
	 */
	public String delTjAsset(String pid);

	/**
	 * 获得竣工决算固定资产清单+信息树，用于施工单位查询弹出页面
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	竣工决算固定资产清单+信息树
	 */
	public List<ColumnTreeNode> fafixedassetquerytree(String orderBy, Integer start, Integer limit, HashMap map);

	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 * @author zhangh 2013-8-21
	 */
	public InputStream getExcelTemplate(String businessType);

	/**
	 * 向固定资产模板写入数据
	 * @param map1	查询条件
	 * @param wb	工作簿
	 * @return	Excel输出流
	 * @author pengy 2014-03-24
	 */
	public ByteArrayOutputStream fillDataToFixedAssetExcel(Workbook wb, Map<String, String> map1) throws DbPropertyException, SQLException, IOException, ExcelPortException;

}