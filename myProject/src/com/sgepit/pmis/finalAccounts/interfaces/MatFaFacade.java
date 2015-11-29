package com.sgepit.pmis.finalAccounts.interfaces;

import java.util.HashMap;
import java.util.List;


public interface MatFaFacade {
	/**
	 * 获取物资出库单信息
	 * @param pid		:	项目编号（多项目共用同一系统使用）
	 * @param outType	:	物资出库类型：1计划内；2计划外；如果此字段为空，表示查询所有出库单；
	 * @param orderBy	:	排序字符
	 * @param param		:	提供查询条件的参数：如出库单编号{{“outNo”,”GQ”}}and outNo like ‘%GQ%’
	 * @param start		:	分页显示的起始
	 * @param limit		:	分页显示一页显示的行数
	 * @return				返回出库单的列表
	 */
	public List getMatStockOut (String pid, String outType, String orderBy, HashMap<String, String> param, Integer start, Integer limit);
	
	/**
	 * 获取出库单对应的出库物资明细
	 * @param pid		:	项目编号（多项目共用同一系统使用）
	 * @param outId		:	出库单编码
	 * @param orderBy	:	排序字符串
	 * @param param		:	提供查询条件的参数：如出库单编号{{“outNo”,”GQ”}}and outNo like ‘%GQ%’
	 * @param start		:	分页显示的起始
	 * @param limit		:	分页显示一页显示的行数
	 * @return				返回出库单的出库物质列表
	 */
	public List getMatStockOutDetail (String pid, String outId,String orderBy, HashMap<String, String> param, Integer start, Integer limit);
}
