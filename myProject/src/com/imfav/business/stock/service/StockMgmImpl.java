package com.imfav.business.stock.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import com.imfav.business.customer.hbm.CustBacklog;
import com.imfav.business.customer.hbm.Customer;
import com.imfav.business.stock.dao.StockDao;
import com.imfav.business.stock.hbm.Stock;
import com.imfav.business.stock.hbm.StockSina;
import com.imfav.frame.util.UrlConnUtil;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;

/**
 * 类说明
 * @author zhangh
 * @version 创建时间：2015年12月6日 下午11:33:48
 */
public class StockMgmImpl extends BaseMgmImpl implements StockMgm {
	private static final Log log = LogFactory.getLog(StockMgmImpl.class);
	
	private StockDao stockDao;

	public StockDao getStockDao() {
		return stockDao;
	}

	public void setStockDao(StockDao stockDao) {
		this.stockDao = stockDao;
	}
	
	/**
	 * 后台直接获取session中用户userid
	 * @return
	 */
	private String getCurrentUserid(){
		String userid = "";
		WebContext webContext = WebContextFactory.get();    
		if(webContext!=null){
			HttpSession session = webContext.getSession() ;
			userid = session.getAttribute(Constant.USERID).toString(); 
		}
		return userid;
	}
	
	@Override
	public StockSina getStockFromSina(String stockNo){
		try {
			String sinaStockUrl = "http://hq.sinajs.cn/";
			sinaStockUrl += "/list="+stockNo;
			String rtn = UrlConnUtil.loadGBKJson(sinaStockUrl);
			StockSina stock = new StockSina();
			if(null == rtn || "FAILED".equals(rtn)){
	//			查询失败，失败结果可能为：var hq_str_sys_auth="FAILED";或var hq_str_sh601006="";
				return null;
			}
			if(rtn.indexOf("=") > 0){
				String[] tempArr = rtn.split("=");
				if(tempArr.length == 2){
					String sotckInfo = tempArr[1];
					sotckInfo = sotckInfo.substring(1, sotckInfo.length()-2);
					String[] sotckInfoArr = sotckInfo.split(",");
					if(sotckInfoArr.length > 0){
						stock.setStockName(sotckInfoArr[0]);
						stock.setStockNo(stockNo);
						stock.setOpenPosition(0d);
						stock.setHaveNumber(0l);
						stock.setNowPrice(Double.parseDouble(sotckInfoArr[3]));
						return stock;
					}else{
						return null;
					}
				}else{
					return null;
				}
			}else{
				return null;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	@Override
	public String addOrUpdateStock(Stock stock){
		try {
			String uids = stock.getUids();
			stock.setEditTime(new Date());
			if(null == uids || "".equals(uids)){
				stock.setAddTime(new Date());
				stock.setAddUser(this.getCurrentUserid());
				uids = stockDao.insert(stock);
			}else{
				stock.setEditTime(new Date());
				stock.setEditUser(this.getCurrentUserid());
				stockDao.saveOrUpdate(stock);
			}
			return uids;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	@Override
	public String addOrUpdateStockBacklog(CustBacklog custBacklog){
		try {
			String uids = custBacklog.getUids();
			if(null == uids || "".equals(uids)){
				custBacklog.setAddTime(new Date());
				custBacklog.setAddUser(this.getCurrentUserid());
				uids = stockDao.insert(custBacklog);
			}else{
				stockDao.saveOrUpdate(custBacklog);
			}
			return uids;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	@Override
	public Integer deleteStock(String uids){
		Integer num = 0;
		try {
			Stock stock = (Stock) stockDao.findById(Stock.class.getName(), uids);
			if(null != stock){
				stockDao.delete(stock);
				num = 1;
			}
			return num;
		} catch (Exception e) {
			return num;
		}
	}

	
	@Override
	public Integer refreshStockPrice(){
		Integer num = 0;
		try {
			String sql = "SELECT wm_concat(stock_no) stock_no FROM (SELECT t.stock_no FROM crm_stock t GROUP BY t.stock_no)";
			List<Map<String, String>> list = JdbcUtil.query(sql);
			String stockNoStr = "";
			if (list.size()>0) {
				stockNoStr = list.get(0).get("stock_no");
			}
			String sinaStockUrl = "http://hq.sinajs.cn/";
			sinaStockUrl += "/list="+stockNoStr;
			String rtn = UrlConnUtil.loadGBKJson(sinaStockUrl);
			System.out.println("股票查询返回结果："+rtn);
			StockSina stock = new StockSina();
			if(null == rtn || "FAILED".equals(rtn)){
	//			查询失败，失败结果可能为：var hq_str_sys_auth="FAILED";或var hq_str_sh601006="";
				return num;
			}
			String[] rtnArr = rtn.split(";");
			List<String> listSql = new ArrayList<String>();
			for (int i = 0; i < rtnArr.length; i++) {
				String stockRtn = rtnArr[i];
				if(stockRtn.indexOf("=") > 0){
					String[] tempArr = stockRtn.split("=");
					if(tempArr.length == 2){
						String var = tempArr[0];
						String stockNo = var.substring(var.lastIndexOf("_")+1);
						String sotckInfo = tempArr[1];
						sotckInfo = sotckInfo.substring(1, sotckInfo.length()-2);
						String[] sotckInfoArr = sotckInfo.split(",");
						if(sotckInfoArr.length > 0){
							//sotckInfoArr[3] = 现价
							String updateSql = "update crm_stock t set t.now_price = "+sotckInfoArr[3]+" "
									+ " where t.stock_no = '"+stockNo+"' and t.stock_deal = 'buy' ";
							String updateSql2 = "update crm_stock t set t.now_price = "+sotckInfoArr[3]+", "
									+ " t.profit_point = (("+sotckInfoArr[3]+" - t.open_position)/t.open_position*100),"
									+ " t.income_money = (("+sotckInfoArr[3]+" - t.open_position)*t.have_number)"
									+ " where t.stock_no = '"+stockNo+"' and t.stock_deal = 'buy' and t.open_position != 0";
							listSql.add(updateSql);
							listSql.add(updateSql2);
						}else{
							return num;
						}
					}else{
						return num;
					}
				}
			}
			int[] intArr = null;
			if(listSql.size() > 0){
				intArr = JdbcUtil.batchUpdate(listSql.toArray(new String[0]));
	        }
			return intArr.length;
		} catch (Exception e) {
			e.printStackTrace();
			return num;
		}
	}
	
	@Override
	public Integer selectCustomerUser(String[] uidsArr,String userid,String state){
		Integer num = 0;
		try {
			List<String> listSql = new ArrayList<String>();
			for (int i = 0; i < uidsArr.length; i++) {
				String uids = uidsArr[i];
				if(null != uids && !"".equals(uids)){
					String uuid = UUID.randomUUID().toString().replace("-", "");
					String sql = "insert into CRM_CUST_USER values('"+uuid+"','"+uids+"','"+userid+"','"+state+"')";
					listSql.add(sql);
				}
			}
			int[] intArr = null;
			if(listSql.size() > 0){
				intArr = JdbcUtil.batchUpdate(listSql.toArray(new String[0]));
	        }
			num = intArr.length;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return num;
	}
	
	@Override
	public Integer removeCustomerUser(String[] uidsArr,String userid){
		Integer num = 0;
		try {
			List<String> listSql = new ArrayList<String>();
			for (int i = 0; i < uidsArr.length; i++) {
				String uids = uidsArr[i];
				if(null != uids && !"".equals(uids)){
					String sql = "delete CRM_CUST_USER where cust_uids = '"+uids+"' and userid = '"+userid+"'";
					listSql.add(sql);
				}
			}
			int[] intArr = null;
			if(listSql.size() > 0){
				intArr = JdbcUtil.batchUpdate(listSql.toArray(new String[0]));
	        }
			num = intArr.length;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return num;
	}

}
