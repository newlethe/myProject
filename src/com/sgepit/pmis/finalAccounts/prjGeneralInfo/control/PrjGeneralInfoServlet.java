package com.sgepit.pmis.finalAccounts.prjGeneralInfo.control;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjInfoOve;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.service.FAPrjInfoOveService;

public class PrjGeneralInfoServlet extends MainServlet {

	private FAPrjInfoOveService prjInfoOveService;

	public FAPrjInfoOveService getPrjInfoOveService() {
		return prjInfoOveService;
	}

	public void setPrjInfoOveService(FAPrjInfoOveService prjInfoOveService) {
		this.prjInfoOveService = prjInfoOveService;
	}

	public void init(ServletConfig config) throws ServletException {
		// 通过Spring获取Service bean
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);

		prjInfoOveService = (FAPrjInfoOveService) wac
				.getBean("prjInfoOveService");

	}
	
	private void getPrjOveInfo(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String pid = request.getSession().getAttribute(Constant.CURRENTAPPPID).toString();

		String retVal = formObjectToJSONReaderStr(prjInfoOveService.getPrjInfoOve(pid));
		
		response.getWriter().write(retVal);
	}
	
	private void deleteAll(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		String beanName = request.getParameter("beanName");
		String jsonData = request.getParameter("data");
		JSONArray jsonArray = JSONArray.fromObject(jsonData);
		try {
			Object[] objArr= (Object[]) JSONArray.toArray(jsonArray,
					Class.forName(beanName));
			prjInfoOveService.delete(objArr);
		} catch (ClassNotFoundException e) {
			
			e.printStackTrace();
		}

		

	}
	
	private void saveOrUpdateAll(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		String beanName = request.getParameter("beanName");
		String jsonData = request.getParameter("data");
		JSONArray jsonArray = JSONArray.fromObject(jsonData);
		try {
			Object[] objArr= (Object[]) JSONArray.toArray(jsonArray,
					Class.forName(beanName));
			prjInfoOveService.saveOrUpdate(objArr);
		} catch (ClassNotFoundException e) {
			
			e.printStackTrace();
		}
	}
	
	private void saveOrUpdateOveInfo(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String pid = request.getSession().getAttribute(Constant.CURRENTAPPPID).toString();

		// 得到Json数据
		BufferedReader reader = request.getReader();
		String postData = new String();
		String tempLine;
		while ((tempLine = reader.readLine()) != null) {
			postData += tempLine;
		}

		// 将Json数据转化为对象
		JSONObject jsonObject = JSONObject.fromObject(postData);
		FAPrjInfoOve infoOve = (FAPrjInfoOve) JSONObject.toBean(jsonObject,
				FAPrjInfoOve.class);
		infoOve.setUids(pid);
		prjInfoOveService.saveOrUpdate(infoOve);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String method = request.getParameter("ac");

		if (method != null) {

			if (method.equalsIgnoreCase("getPrjOveInfo")) {
				getPrjOveInfo(request, response);
			} else if(method.equalsIgnoreCase("save-update-all")) {
				saveOrUpdateAll(request, response);
			}else if(method.equalsIgnoreCase("delete-all")) {
				deleteAll(request, response);
			}else if(method.equalsIgnoreCase("save-one")) {
				saveOrUpdateOveInfo(request, response);
			}

		}

	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);

	}
	
	private static String formObjectToJSONReaderStr(Object obj) {
		if ( obj != null ){
			String str = "";
			str += "{ 'success': true, 'data': ";
			str += JSONObject.fromObject(obj).toString();
			str += "}";
			return str;
		}
		else{
			return "{success:false}";
		}
	}

}
