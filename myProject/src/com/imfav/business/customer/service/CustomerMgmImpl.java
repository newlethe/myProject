package com.imfav.business.customer.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.collections.map.ListOrderedMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypTree;
import com.imfav.business.customer.dao.CustomerDao;
import com.imfav.business.customer.hbm.CustBack;
import com.imfav.business.customer.hbm.Customer;
import com.imfav.business.customer.hbm.ViewBusinessStatistics;
import com.imfav.business.customer.hbm.ViewCustStock;
import com.imfav.business.stock.hbm.Stock;
import com.imfav.frame.util.BeanHelper;
import com.imfav.frame.util.UrlConnUtil;
import com.mysql.fabric.xmlrpc.base.Array;

/**
 * 客户管理类
 * @author zhangh
 * @version 创建时间：2015年12月5日 下午11:20:27
 */
public class CustomerMgmImpl extends BaseMgmImpl implements CustomerMgm {
	private static final Log log = LogFactory.getLog(CustomerMgmImpl.class);
	
	private CustomerDao customerDao;
	private ApplicationMgmFacade applicationMgm;

	public CustomerDao getCustomerDao() {
		return customerDao;
	}

	public void setCustomerDao(CustomerDao customerDao) {
		this.customerDao = customerDao;
	}
	
	public ApplicationMgmFacade getApplicationMgm() {
		return applicationMgm;
	}

	public void setApplicationMgm(ApplicationMgmFacade applicationMgm) {
		this.applicationMgm = applicationMgm;
	}
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	
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
//				List list = customerDao.findByWhere(Customer.class.getName(), "mobile = '"+mobile+"'");
//				if(list.size() > 0){
//					return "1";
//				}
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
			custBack.setPayway(customer.getPayway());
			custBack.setBackMoney(customer.getDeposit());
			custBack.setBackTime(new Date());
			custBack.setAddTime(new Date());
			custBack.setAddUser(getCurrentUserid());
			customerDao.insert(custBack);
			//修改客户状态和回款
			customer.setState("1");
			customer.setBack(customer.getBack()+customer.getDeposit());
			customer.setBackTime(new Date());
			customerDao.saveOrUpdate(customer);
			return "1";
		}catch (Exception e){
			e.printStackTrace();
			return "0";
		}
	}
	
	
	@Override
	public String getMobileFrom(String mobile){
		String from = "";
		try {
			//返回JSON格式
			String url = "http://virtual.paipai.com/extinfo/GetMobileProductInfo?mobile="+mobile+"&amount=10000&callname=getPhoneNumInfoExtCallback";
			url = "http://apis.juhe.cn/mobile/get?callback=jQuery18301382324884081252_1464791159907&phone="+mobile+"&dtype=jsonp&key=b4b88a8ffc09e2fd3f24251ee19fa168&_=1464791169811";
			String rtn = UrlConnUtil.loadUTF8Json(url);
			if(null != rtn && !"".equals(rtn) && rtn.indexOf("未知") == -1){
				rtn = rtn.substring(rtn.indexOf("(")+1, rtn.lastIndexOf(")"));
				System.out.println("手机号归属信息："+rtn);
				JSONObject json = JSONObject.fromObject(rtn);
				JSONObject result = json.getJSONObject("result");
				from += null == result.get("province") ? "" : result.get("province").toString();
				from += "||";
				from += null == result.get("city") ? "" : result.get("city").toString();
			}
			//财付通API地址：返回XML格式
			//String url = "http://life.tenpay.com/cgi-bin/mobile/MobileQueryAttribution.cgi?chgmobile="+mobile;
			//String rtn = UrlConnUtil.loadUTF8Json(url);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return from;
	}
	
	
	public List findBusinessStatistics(String beanName, String where, String orderBy,
			Integer firstRow, Integer maxRow, String isManager, String between) {
		String sql = "select * from (SELECT ROWNUM rn, t.manager uids, '' salesman,t.manager,t.director, "
				+ " ((SELECT COUNT(1) FROM crm_customer a WHERE "
				+ " t.manager = a.manager and "+between.replaceAll("b.back_Time", "a.add_Time")+")) send_num, "
				+ " (SELECT COUNT(1) FROM (SELECT DISTINCT B.CUST_UIDS,A.manager FROM (SELECT MIN(bb.back_time) back_time,bb.cust_uids FROM CRM_CUST_BACK bb GROUP BY bb.cust_uids) b,crm_customer a WHERE "
				+ " 1=1 AND a.uids = b.cust_uids AND a.state = '1' and "+between+") AA WHERE T.manager = AA.manager) back_num, "
				+ " ((SELECT nvl(SUM(b.back_money),0) FROM crm_cust_back b,crm_customer a WHERE "
				+ " t.manager = a.manager AND a.uids = b.cust_uids AND a.state = '1' and "+between+")) sum_money "
				+ " FROM (SELECT x.manager,x.director "
				+ " FROM crm_customer x WHERE 1=1 AND x.manager IS NOT NULL AND x.director IS NOT NULL "
				+ " GROUP BY x.manager,x.director) t) where " + where;
		if("true".equals(isManager)){
			sql = "select * from (SELECT ROWNUM rn, t.salesman uids, t.salesman,t.manager,t.director, "
				+ " ((SELECT COUNT(1) FROM crm_customer a WHERE "
				+ " t.salesman = a.salesman and "+between.replaceAll("b.back_Time", "a.add_Time")+")) send_num, "
				+ " (SELECT COUNT(1) FROM (SELECT DISTINCT B.CUST_UIDS,A.SALESMAN FROM (SELECT MIN(bb.back_time) back_time,bb.cust_uids FROM CRM_CUST_BACK bb GROUP BY bb.cust_uids) b,crm_customer a WHERE "
				+ " 1=1 AND a.uids = b.cust_uids AND a.state = '1' and "+between+") AA WHERE T.SALESMAN = AA.SALESMAN) back_num, "
				+ " ((SELECT nvl(SUM(b.back_money),0) FROM crm_cust_back b,crm_customer a WHERE "
				+ " t.salesman = a.salesman AND a.uids = b.cust_uids AND a.state = '1' and "+between+")) sum_money "
				+ " FROM (SELECT x.salesman,x.manager,x.director "
				+ " FROM crm_customer x WHERE 1=1 AND x.salesman IS NOT NULL AND x.manager IS NOT NULL AND x.director IS NOT NULL "
				+ " GROUP BY x.salesman,x.manager,x.director) t) where " + where;
		}
		if (firstRow != null && maxRow != null){
			sql = "select tt.* from ("+ sql + ") tt where rn > "+firstRow+" and rn <="+(firstRow+maxRow)+" ";
		}
		System.out.println(sql);
		List list = new ArrayList();
		List<Map<String, Object>> li = JdbcUtil.query(sql);
		if (li == null || li.size() == 0){
			return list;
		}
		for (int i = 0; i < li.size(); i++) {
			Map<String, Object> obj = (ListOrderedMap) li.get(i);
			ViewBusinessStatistics view = new ViewBusinessStatistics();
			view.setUids(null == obj.get("UIDS") ? "" : obj.get("UIDS").toString());
			view.setSalesman(null == obj.get("SALESMAN") ? "" : obj.get("SALESMAN").toString());
			view.setManager(null == obj.get("MANAGER") ? "" : obj.get("MANAGER").toString());
			view.setDirector(null == obj.get("DIRECTOR") ? "" : obj.get("DIRECTOR").toString());
			view.setSendNum(null == obj.get("SEND_NUM") ? 0l : Long.parseLong(obj.get("SEND_NUM").toString()));
			view.setBackNum(null == obj.get("BACK_NUM") ? 0l : Long.parseLong(obj.get("BACK_NUM").toString()));
			view.setSumMoney(null == obj.get("SUM_MONEY") ? 0d : Double.parseDouble(obj.get("SUM_MONEY").toString()));
			list.add(view);
		}
		list.add(li.size());
		return list;
	}

	
	
	public HSSFWorkbook exportExcelByHeaderAndWhere(String header, String where) {
		List<ViewCustStock> listData = customerDao.findByWhere(ViewCustStock.class.getName(), where);
		// 第一步，创建一个webbook，对应一个Excel文件
		HSSFWorkbook wb = new HSSFWorkbook();
		// 第二步，在webbook中添加一个sheet,对应Excel文件中的sheet
		HSSFSheet sheet = wb.createSheet("Sheet1");
		
		//设置header行样式
		HSSFCellStyle style = wb.createCellStyle();
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直居中     
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 水平居中    
		style.setFillForegroundColor((short) 13);// 背景颜色
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
		HSSFFont font = wb.createFont();//设置字体
		font.setFontName("黑体");
//		font.setColor(HSSFColor.BLUE.index);
		font.setFontHeightInPoints((short) 10);//设置字体大小
		style.setFont(font);//选择需要用到的字体格式
		style.setWrapText(true);//设置自动换行
		
		// 第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short
		//header行设置开始
        HSSFRow row = sheet.createRow((int) 0);
        row.setHeight((short) 500);
        HSSFCell cell = row.createCell((short) 0);
        String[] headerArr = header.split("~");
        //循环设置表头列单元格文字和样式
        for (int i = 0; i < headerArr.length; i++) {
        	String temp = headerArr[i];
        	String[] head = temp.split("=");
        	cell = row.createCell((short) i);
    		cell.setCellValue(head[1]);
    		sheet.setColumnWidth(i, 3000);
    		if("备注".equals(head[1])){
    			sheet.setColumnWidth(i, 8000);
    		}
    		cell.setCellStyle(style);
		}
        //需要特殊转换的字段
        Map<String,List> map = setSpecialMap();
        
        //循环设置数据
        try {
        	HSSFCell dataCell = null;
        	for (int i = 0; i < listData.size(); i++) {
            	row = sheet.createRow((int) i + 1);
            	ViewCustStock custStock = listData.get(i);
            	for (int j = 0; j < headerArr.length; j++) {
            		String temp = headerArr[j];
                	String[] head = temp.split("=");
                	Object obj = BeanHelper.getFieldValue(custStock,head[0]);
                	String val = "";
                	dataCell = row.createCell((short) j);
                	if(null != obj){
                		String type = obj.getClass().getName();
                		if("java.sql.Timestamp".equals(type)){
                			val = sdf.format(obj);
                		}else{
                			val = obj.toString();
                			//字段的特殊处理
                			val = setSpecialVal(val, head[0], map);
                		}
                	}
                	dataCell.setCellValue(val);
                	dataCell.setCellStyle(style);
				}
    		}
		} catch (Exception e) {
			e.printStackTrace();
		}
//    	 第六步，将文件存到指定位置
//		{
//			FileOutputStream fout = new FileOutputStream("C:/Users/Administrator/Desktop/质量验评统计表.xls");
//			wb.write(fout);
//			fout.close();
//		}
//		catch (Exception e)
//		{
//			e.printStackTrace();
//		}
       return wb;
	}
	
	
	private Map<String,List> setSpecialMap(){
		Map<String,List> map = new HashMap<String, List>();
		List<PropertyCode> list_PropertyCode = applicationMgm.getCodeValue("客户状态");
        map.put("haveState", list_PropertyCode);
        String sql = "SELECT USERID,REALNAME FROM ROCK_USER";
		List<Map<String, String>> list_UserMap = JdbcUtil.query(sql);
		map.put("salesman", list_UserMap);
		return map;
	}
	
	/**
	 * 导出时候的特殊处理，包括属性值转换，主键转换
	 * @param val
	 * @return
	 */
	private String setSpecialVal(String val,String head, Map<String,List> map){
		if("haveState".equals(head)){
			//处理客户状态
			List list_PropertyCode = map.get("haveState");
			for (int i = 0; i < list_PropertyCode.size(); i++) {
				PropertyCode propertyCode = (PropertyCode) list_PropertyCode.get(i);
				String code = propertyCode.getPropertyCode() == null ? "" : propertyCode.getPropertyCode();
				String name = propertyCode.getPropertyName() == null ? "" : propertyCode.getPropertyName();
				if(val.equals(code)){
					val = name;
					break;
				}
			}
		}else if("salesman".equals(head)){
			//处理userid
			List list_UserMap = map.get("salesman");
			for (int i = 0; i < list_UserMap.size(); i++) {
				Map<String, String> userMap = (Map<String, String>) list_UserMap.get(i);
				String userid = userMap.get("USERID") == null ? "" : userMap.get("USERID");
				String realname = userMap.get("REALNAME") == null ? "" : userMap.get("REALNAME");
				if(val.equals(userid)){
					val = realname;
					break;
				}
			}
		}else if("incomeMoney".equals(head)){
			//为了页面排序，视图CRM_VIEW_CUST_STOCK中特殊处理过收益，为0，则视图输出-999999，所以此处导出需要特殊转换
			if("-999999".equals(val) || "-999999.0".equals(val)){
				val = "0";
			}
		}
		return val;
	}

}
