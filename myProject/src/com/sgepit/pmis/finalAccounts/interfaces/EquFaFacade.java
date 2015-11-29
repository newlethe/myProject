package com.sgepit.pmis.finalAccounts.interfaces;

import java.util.HashMap;
import java.util.List;


public interface EquFaFacade {
	/**
	 * 获取某设备合同的出库设备明细信息
	 * @param pid		:	项目编号（多项目共用同一系统使用）
	 * @param conid		:	出库单编码
	 * @param orderBy	:	排序字符串
	 * @param param		:	提供查询条件的参数：如出库单编号{{“outNo”,”GQ”}}and outNo like ‘%GQ%’
	 * @param start		:	分页显示的起始
	 * @param limit		:	分页显示一页显示的行数
	 * @return				返回出库单的设备明细信息列表
	 */
	public List getEquStockOutDetail(String pid, String conId, String orderBy, HashMap<String, String> param, Integer start, Integer limit);
}
