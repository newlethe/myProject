/**
 * Central China Technology Development of Electric Power Company LTD.
 * com.hdkj.sgcc.planAdjust.control.PlanAdjustServlet.java
 * @author: Shirley
 * @version: 2009
 *
 *
 */

package com.sgepit.pmis.wzgl.control;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.datastructure.UpdateBeanInfo;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.pmis.wzgl.hbm.ViewWzArriveCgjh;
import com.sgepit.pmis.wzgl.hbm.ViewWzConCgjh;
import com.sgepit.pmis.wzgl.hbm.WzArriveApply;
import com.sgepit.pmis.wzgl.hbm.WzCdjinPb;
import com.sgepit.pmis.wzgl.hbm.WzInput;
import com.sgepit.pmis.wzgl.service.StockMgmFacade;

/**
  * 计划调整
  * @author Shirley's
  * @createDate May 19, 2009
  **/
public class MatServlet extends MainServlet {	
	public MatServlet() {
		super();
	}
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String method = request.getParameter("ac");
		if (method != null) {			
			if (method.equals("listCollectApply")) {//获取汇总的需用计划
				getCollectApply(request, response);
				return;
			} 
			if (method.equals("listArriveCgjh")) {//到货时，获取采购计划的列表
				getArriveCgjh(request, response);
				return;
			}
			if (method.equals("arriveAndCreateInput")) {//从采购计划生成到货物资清单（入库物资清单）
				arriveAndCreateInput(request, response);
				return;
			}
			if (method.equals("getArriveMatByID")) {//根据ID获取到货物资清单（用户到货入库分摊的Form的数据）
				getArriveMatByID(request, response);
				return;
			}
			if (method.equals("getArriveApply")) {//根据到货的物资清单获取需要进行分摊的需用计划
				getArriveApply(request, response);
				return;
			}
			if (method.equals("saveArriveMat")) {//保存到货物资清单，更新采购计划到货情况、申请计划分摊数据
				saveArriveMat(request, response);
				return;
			}
			if (method.equals("deleteArriveMat")) {//保存到货物资清单，更新采购计划到货情况、申请计划分摊数据
				deleteArriveMat(request, response);
				return;
			}
			if (method.equals("listConCgjh")) {//采购合同录入时，获取采购计划的列表
				getConCgjh(request, response);
				return;
			}
			if (method.equals("crateConMatFromCgjh")) {//从采购计划生成到货物资清单（入库物资清单）
				crateConMatFromCgjh(request, response);
				return;
			}
			if (method.equals("deleteConMat")) {//保存到货物资清单，更新采购计划到货情况、申请计划分摊数据
				deleteConMat(request, response);
				return;
			}
			//功能还不完善，需要进一步调整，目前没有被调用
			if (method.equals("saveArriveMatAfterEdit")) {//保存到货物资清单，更新采购计划到货情况、申请计划分摊数据
				saveArriveMatAfterEdit(request, response);
				return;
			}
			
			
			
			
			
		}

	}
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}
	
	public void getCollectApply(HttpServletRequest request,
			HttpServletResponse response) throws IOException {		
		String whereStr = request.getParameter("whereStr");
		Integer start = request.getParameter("start") != null ? Integer.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer.valueOf(request.getParameter("limit")) : null;
		StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");
		List pList = stockMgm.getCollectApply(whereStr, start, limit);
		String jsonStr = makeJsonDataForGrid(pList);
		outputStr(response, jsonStr);
	}
	public void getArriveCgjh(HttpServletRequest request,
			HttpServletResponse response) throws IOException {		
		String whereStr = request.getParameter("whereStr");
		String orderBy = request.getParameter("orderColumn");
		Integer start = request.getParameter("start") != null ? Integer.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer.valueOf(request.getParameter("limit")) : null;
		StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");
		List pList = stockMgm.getArriveCgjh(whereStr, orderBy,start, limit);
		String jsonStr = makeJsonDataForGrid(pList);
		//System.out.println(jsonStr);
		outputStr(response, jsonStr);
	}
	
	public void arriveAndCreateInput(HttpServletRequest request,
			HttpServletResponse response) throws IOException {		
		
		String primaryKey = request.getParameter("primaryKey");
		//到货编号
		String arriveBh = request.getParameter("dhbh");
		//发票号
		String fph = request.getParameter("fph");
		String username= request.getParameter("username");
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		
		int c = 0;
		try {
			UpdateBeanInfo jab = parseJsonStr(StringUtil.getInputStream(request
					.getInputStream(), Constant.ENCODING), "com.sgepit.pmis.wzgl.hbm.ViewWzArriveCgjh", primaryKey);
			List<Object> beanList = jab.beanList;
			Set<String> columnSet = jab.columnSet;
			List<String> pkValueList = jab.pkValueList;
			HttpSession s = request.getSession();
			String pid = s.getAttribute(Constant.CURRENTAPPPID).toString();
			StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");
			WzCdjinPb cdjInPbHbm = stockMgm.getWzCdjInPb(arriveBh);
			for (int i = 0; i < beanList.size(); i++) {
				String id = (String) pkValueList.get(i);
				String rkbh= stockMgm.getStockPlanNewBhNoSession(username, "bh", "wz_input", null, pid);
				ViewWzArriveCgjh hbm = (ViewWzArriveCgjh)beanList.get(i);
				stockMgm.arriveAndCreateInput(hbm, cdjInPbHbm, fph, rkbh, pid);
				c++;
			}
		} catch (Exception e) {
			msg = getSQLErrorMsg(e);
			e.printStackTrace();
			stackTrace = getStackTrace(e);
		}
		sendMsgResponse(msg, stackTrace, c, response);
	}
	
	public void getArriveMatByID(HttpServletRequest request,
			HttpServletResponse response) throws IOException {		
		String uid = request.getParameter("uids");
		StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");		
		WzInput item = stockMgm.getArriveMatByID(uid);
		String jsonStr = JSONUtil.formObjectToJSONReaderStr(item);
		System.out.println("jsonStr:"+jsonStr);
		outputStr(response, jsonStr);
	}
	
	public void getArriveApply(HttpServletRequest request,
			HttpServletResponse response) throws IOException {		
		String whereStr = request.getParameter("whereStr");	
		String arriveBh = request.getParameter("arriveBh");	
		String sort = request.getParameter("sort");	
		StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");
		List pList = stockMgm.getArriveApply(whereStr, arriveBh,sort);
		String jsonStr = makeJsonDataForGrid(pList);
		System.out.println(jsonStr);
		outputStr(response, jsonStr);
	}
	
	public void saveArriveMat(HttpServletRequest request,
			HttpServletResponse response) throws IOException {		
		
		String rtn = "{success:";
		String primaryKey = request.getParameter("primarykey");			
		int c = 0;
		try {
			String jsonData = StringUtil.getInputStream(request.getInputStream(), Constant.ENCODING);
			String[] jsonArr = jsonData.split("``");
			System.out.println(jsonData);
			//grid数据保存
			String beanName = "com.sgepit.pmis.wzgl.hbm.WzArriveApply";
			
			StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");	
			
			//forms数据保存
			String ITEMBEAN = WzInput.class.getName();
			WzInput inputHbm = (WzInput) JSONObject.toBean(JSONObject.fromObject(jsonArr[1]), Class.forName(ITEMBEAN));
			stockMgm.saveArriveMat(inputHbm);
			
			if(jsonArr[0]!= null && !jsonArr[0].equals("[]")){
				UpdateBeanInfo jab = parseJsonStr(jsonArr[0],beanName , primaryKey);
				List<Object> beanList = jab.beanList;			
				List<String> pkValueList = jab.pkValueList;		
				for (int i = 0; i < beanList.size(); i++) {
					String id = (String) pkValueList.get(i);
					WzArriveApply arriveApplyHbm= (WzArriveApply)beanList.get(i);
					//arriveApplyHbm.setPid(inputHbm.getHth());//将合同号传过去，赋值给pid（pid作为合同号的备用字段）
					stockMgm.saveArriveApply(arriveApplyHbm,inputHbm.getPbbh());
				}
			}
			
			
			rtn += "true,msg:''}";
		} catch (Exception ex) {
			rtn += "false,msg:'" + ex.getMessage() + "'}";
			ex.printStackTrace();
			//stackTrace = getStackTrace(e);
		}
		outputStr(response, rtn);
	}
	

	public void deleteArriveMat(HttpServletRequest request, HttpServletResponse response) {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		
		int c = 0;
		try {
			String ids = (String) request.getParameter("ids");
			String[] ida = ids.split("\\,");
			StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");	
			c = stockMgm.deleteArriveMat(ida);
		} catch (Exception e) {
			msg = getSQLErrorMsg(e);
			stackTrace = getStackTrace(e);
		}
		sendMsgResponse(msg, stackTrace, c, response);
	}
	
	public void getConCgjh(HttpServletRequest request,
			HttpServletResponse response) throws IOException {		
		String whereStr = request.getParameter("whereStr");
		String orderBy = request.getParameter("orderColumn");
		Integer start = request.getParameter("start") != null ? Integer.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer.valueOf(request.getParameter("limit")) : null;
		StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");
		List pList = stockMgm.getConCgjh(whereStr, orderBy,start, limit);
		String jsonStr = makeJsonDataForGrid(pList);
		//System.out.println(jsonStr);
		outputStr(response, jsonStr);
	}
	
	
	public void crateConMatFromCgjh(HttpServletRequest request,
			HttpServletResponse response) throws IOException {		
		
		String primaryKey = request.getParameter("primaryKey");
		//合同编号
		String conBh = request.getParameter("hth");		
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		
		int c = 0;
		try {
			UpdateBeanInfo jab = parseJsonStr(StringUtil.getInputStream(request
					.getInputStream(), Constant.ENCODING), "com.sgepit.pmis.wzgl.hbm.ViewWzConCgjh", primaryKey);
			List<Object> beanList = jab.beanList;
			Set<String> columnSet = jab.columnSet;
			int columnSize = columnSet.size();
			List<String> pkValueList = jab.pkValueList;
			
			StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");
			//WzCdjinPb cdjInPbHbm = stockMgm.getWzCdjInPb(conBh);
			for (int i = 0; i < beanList.size(); i++) {
				String id = (String) pkValueList.get(i);
				
				ViewWzConCgjh hbm = (ViewWzConCgjh)beanList.get(i);
				stockMgm.crateConMatFromCgjh(conBh,hbm);
				c++;
			}
		} catch (Exception e) {
			msg = getSQLErrorMsg(e);
			e.printStackTrace();
			stackTrace = getStackTrace(e);
		}
		sendMsgResponse(msg, stackTrace, c, response);
	}
	
	public void deleteConMat(HttpServletRequest request, HttpServletResponse response) {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		
		int c = 0;
		try {
			String ids = (String) request.getParameter("ids");
			String[] ida = ids.split("\\,");
			StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");	
			c = stockMgm.deleteConMat(ida);
		} catch (Exception e) {
			msg = getSQLErrorMsg(e);
			stackTrace = getStackTrace(e);
		}
		sendMsgResponse(msg, stackTrace, c, response);
	}
	/*
	 * 功能还不完善需要进一步调整
	 */
	public void saveArriveMatAfterEdit(HttpServletRequest request,
			HttpServletResponse response) throws IOException {		
		
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		String primaryKey = request.getParameter("primarykey");			
		int c = 0;
		try {
			String jsonData = StringUtil.getInputStream(request.getInputStream(), Constant.ENCODING);
			
			//grid数据保存
			String beanName = "com.sgepit.pmis.wzgl.hbm.WzInput";
			UpdateBeanInfo jab = parseJsonStr(jsonData,beanName , primaryKey);
			List<Object> beanList = jab.beanList;			
			//List<String> pkValueList = jab.pkValueList;				
			StockMgmFacade stockMgm = (StockMgmFacade) wac.getBean("StockMgm");	
			
			for (int i = 0; i < beanList.size(); i++) {
				WzInput wzInputHbm= (WzInput)beanList.get(i);
				stockMgm.saveArriveMatAfterEdit(wzInputHbm);				
			}
			c++;
			
		} catch (Exception e) {
			msg = getSQLErrorMsg(e);
			e.printStackTrace();
			stackTrace = getStackTrace(e);
		}
		sendMsgResponse(msg, stackTrace, c, response);
	}

	
}
