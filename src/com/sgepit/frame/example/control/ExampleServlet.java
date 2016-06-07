package com.sgepit.frame.example.control;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.example.service.ExampleMgmFacade;
import com.sgepit.frame.example.service.ExampleMgmImpl;
import com.sgepit.frame.util.JSONUtil;

public class ExampleServlet extends MainServlet {
	private ExampleMgmImpl expMgm;
	private WebApplicationContext wac;
	
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
		.getRequiredWebApplicationContext(servletContext);
		this.expMgm = (ExampleMgmImpl)this.wac.getBean("exampleMgm");
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		doPost(request, response);
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		String method = request.getParameter("ac");
		
		if (method != null) {
			if (method.equals("tree")) {
				buildTree(request, response);
			}
		}
	}
	
	private void buildTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String parentId = request.getParameter("parentId");
		String tree = JSONUtil.formObjectsToJSONStr(this.expMgm.getCategoryByParentID(parentId));
		outputString(response, tree);
	}
}