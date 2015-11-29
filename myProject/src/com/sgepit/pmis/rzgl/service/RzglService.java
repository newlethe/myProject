package com.sgepit.pmis.rzgl.service;

import java.util.List;

import com.sgepit.pmis.rzgl.hbm.RzglFlQxUnit;
import com.sgepit.pmis.rzgl.hbm.RzglFlTree;

/**
 * 日志管理-分类树Service
 * @author zhengw
 * @versionV1.00
 * @since2-14-2-17
 */
public interface RzglService {
	/**
	 * 删除分类节点
	 * @param uids：主键
	 */
	public void deleteById(String uids);
	/**
	 * 得到新的分类编号，
	 * @param prefix：新编号前缀
	 * @param col：编号列名
	 * @param table：表明
	 * @param lsh ：最大流水号，可为空
	 * @return：不重复的新编号
	 */
	public String getNewFlNo( String prefix, String col, String table,Long lsh);
	/**
	 * 查找分类树节点信息
	 * @param uids：节点uids
	 * @return
	 */
	public RzglFlTree findById(String uids);
	/**
	 * 保存分类节点信息list，批量处理
	 * @param entityList：节点信息list
	 */
	public void saveAll(List<RzglFlTree> entityList);
	/**
	 * 保存分类节点权限信息list，批量处理
	 * @param addQxList：权限信息list
	 */
	public void saveAllQx(List<RzglFlQxUnit> addQxList);
	/**
	 * 查询分类权限信息
	 * @param flId：分类节点uids
	 * @param dept：组织机构节点编码
	 * @return 权限信息
	 */
	public RzglFlQxUnit findQxByFlAndDept(String flId, String dept);
	/**
	 * 删除权限信息list，批量删除
	 * @param addQxList 权限list
	 */
	public void deleteAllQx(List<RzglFlQxUnit> addQxList);
	/**
	 * 得到分类节点查询条件，where后节点in的sql条件语句
	 * @param flList
	 * @return 返回in后部分
	 */
	public String getFlWhereInByFlList(List<RzglFlTree> flList);
	/**
	 * 根据分类节点，得到下属分类节点。子孙类
	 * @param selectFl:分类节点uids
	 * @param QxSql:用户有权限的分类节点的sql
	 * @return 下属分类节点
	 */
	public List<RzglFlTree> getSonFlByFl(String selectFl,String QxSql);
	
}
