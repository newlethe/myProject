package com.imfav.business.stock.service;

import com.imfav.business.customer.hbm.CustBacklog;
import com.imfav.business.customer.hbm.Customer;
import com.imfav.business.stock.hbm.Stock;
import com.imfav.business.stock.hbm.StockSina;

/**
 * 类说明
 * @author zhangh
 * @version 创建时间：2015年12月6日 下午11:33:27
 */
public interface StockMgm {
	
	/**
	 * 根据股票代码，从新浪的估计接口获取单个股票详细想信息
	 * 接口：http://hq.sinajs.cn/list=sh601006
	 * <pre>
	 * 这个url会返回一串文本，例如：
	 * var hq_str_sh601006="大秦铁路, 27.55, 27.25, 26.91, 27.55, 26.20, 26.91, 26.92,
	 * 22114263, 589824680, 4695, 26.91, 57590, 26.90, 14700, 26.89, 14300,
	 * 26.88, 15100, 26.87, 3100, 26.92, 8900, 26.93, 14230, 26.94, 25150, 26.95, 15220, 26.96, 2008-01-11, 15:05:32";
	 * 这个字符串由许多数据拼接在一起，不同含义的数据用逗号隔开了，按照程序员的思路，顺序号从0开始。
	 * 0：”大秦铁路”，股票名字；
	 * 1：”27.55″，今日开盘价；
	 * 2：”27.25″，昨日收盘价；
	 * 3：”26.91″，当前价格；
	 * 4：”27.55″，今日最高价；
	 * 5：”26.20″，今日最低价；
	 * 6：”26.91″，竞买价，即“买一”报价；
	 * 7：”26.92″，竞卖价，即“卖一”报价；
	 * 8：”22114263″，成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百；
	 * 9：”589824680″，成交金额，单位为“元”，为了一目了然，通常以“万元”为成交金额的单位，所以通常把该值除以一万；
	 * 10：”4695″，“买一”申请4695股，即47手；
	 * 11：”26.91″，“买一”报价；
	 * 12：”57590″，“买二”
	 * 13：”26.90″，“买二”
	 * 14：”14700″，“买三”
	 * 15：”26.89″，“买三”
	 * 16：”14300″，“买四”
	 * 17：”26.88″，“买四”
	 * 18：”15100″，“买五”
	 * 19：”26.87″，“买五”
	 * 20：”3100″，“卖一”申报3100股，即31手；
	 * 21：”26.92″，“卖一”报价
	 * (22, 23), (24, 25), (26,27), (28, 29)分别为“卖二”至“卖四的情况”
	 * 30：”2008-01-11″，日期；
	 * 31：”15:05:32″，时间；
	 * </pre>
	 * @param stockNo
	 * @return
	 */
	public StockSina getStockFromSina(String stockNo);
	
	
	/**
	 * 新增或保存股票信息
	 * @param stock
	 * @return
	 */
	public String addOrUpdateStock(Stock stock);
	
	/**
	 * 删除股票
	 * @param uids
	 * @return
	 */
	public Integer deleteStock(String uids);
	
	/**
	 * 新增或保存回访日志
	 * @param custBacklog
	 * @return
	 */
	public String addOrUpdateStockBacklog(CustBacklog custBacklog);
	
	/**
	 * 刷新所有股票现价
	 * @return
	 */
	public Integer refreshStockPrice();
	
	/**
	 * 将客户分配到总监和经理
	 * @param uidsArr 客户主键
	 * @param userid 
	 * @param state 1：分配给总监，2分配给经理
	 * @return
	 */
	public Integer selectCustomerUser(String[] uidsArr,String userid,String state);

	
	/**
	 * 将客户从总监和经理分配记录中移除
	 * @param uidsArr 客户主键
	 * @param userid
	 * @return
	 */
	public Integer removeCustomerUser(String[] uidsArr,String userid);
}
