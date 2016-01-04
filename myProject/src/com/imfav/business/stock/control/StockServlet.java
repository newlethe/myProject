package com.imfav.business.stock.control;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.imfav.business.stock.service.StockMgm;
import com.imfav.frame.util.UrlConnUtil;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.pmis.equipment.service.EquMgmFacade;

/**
 * 类说明
 * @author zhangh
 * @version 创建时间：2015年12月6日 下午10:56:09
 */
public class StockServlet extends MainServlet {
	
	private static final Log log = LogFactory.getLog(StockServlet.class);
	
	private StockMgm stockMgm;
	private ServletConfig servletConfig;
	private BaseDAO baseDao;
	
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
		this.stockMgm = (StockMgm) this.wac.getBean("stockMgm");
		baseDao = (BaseDAO)wac.getBean("systemDao");
		servletConfig=config;
	}
	public void destroy() {
		super.destroy();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {}

	public static void main(String[] args) {
		String url = "http://hq.sinajs.cn/list=sh601006";
		String json = UrlConnUtil.loadGBKJson(url);
		json = json.substring(json.indexOf("=")+1);
		json = json.substring(1,json.length()-2);
		System.out.println(json);
		String[] jsonStr = json.split(",");
		for (int i = 0; i < jsonStr.length; i++) {
			System.out.println(jsonStr[i]);
		}
	}

}
