package com.imfav.business.customer.service;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.imfav.business.customer.dao.CustomerDao;
import com.imfav.business.customer.hbm.CustBack;
import com.imfav.business.customer.hbm.Customer;
import com.imfav.business.stock.hbm.Stock;

/**
 * 客户管理类
 * @author zhangh
 * @version 创建时间：2015年12月5日 下午11:20:27
 */
public class CustomerMgmImpl extends BaseMgmImpl implements CustomerMgm {
	private static final Log log = LogFactory.getLog(CustomerMgmImpl.class);
	
	private CustomerDao customerDao;

	public CustomerDao getCustomerDao() {
		return customerDao;
	}

	public void setCustomerDao(CustomerDao customerDao) {
		this.customerDao = customerDao;
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
	public String addOrUpdateCustomer(Customer customer){
		try {
			String uids = customer.getUids();
			String data5= customer.getBackTime().toString();
			if (data5.equals("Thu Jan 01 08:00:00 CST 1970")){
				customer.setBackTime(null);
			}
			if(null == uids || "".equals(uids)){
				String mobile = customer.getMobile();
				List list = customerDao.findByWhere(Customer.class.getName(), "mobile = '"+mobile+"'");
				if(list.size() > 0){
					return "1";
				}
				uids = customerDao.insert(customer);
			}else{
				customerDao.saveOrUpdate(customer);
			}
			return uids;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	@Override
	public String deleteCustomer(String uids){
		try{
			List<Stock> list = customerDao.findByWhere(Stock.class.getName(), "custUids = '"+uids+"'");
			if(list.size() > 0){
				return "2";
			}else{
				Customer customer = (Customer) customerDao.findById(Customer.class.getName(), uids);
				if(null != customer){
					customerDao.delete(customer);
					List<CustBack> list2 = customerDao.findByWhere(CustBack.class.getName(), "custUids = '"+uids+"'");
					customerDao.deleteAll(list2);
					return "1";
				}else{
					return "0";
				}
			}
		} catch (Exception e){
			e.printStackTrace();
			return "0";
		}
	}
	
	
	@Override
	public String customerHasDeposit(String uids){
		try{
			Customer customer = (Customer) customerDao.findById(Customer.class.getName(), uids);
			//增加定金对应的回款
			CustBack custBack = new CustBack();
			custBack.setCustUids(uids);
			custBack.setBackMoney(customer.getDeposit());
			custBack.setBackTime(new Date());
			custBack.setAddTime(new Date());
			custBack.setAddUser(getCurrentUserid());
			customerDao.insert(custBack);
			//修改客户状态和回款
			customer.setState("1");
			customer.setBack(customer.getBack()+customer.getDeposit());
			customerDao.saveOrUpdate(customer);
			return "1";
		}catch (Exception e){
			e.printStackTrace();
			return "0";
		}
	}

}
