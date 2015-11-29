package com.sgepit.frame.base.servlet;

import java.io.InputStream;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.sql.DataSource;

import org.logicalcobwebs.proxool.ProxoolDataSource;
import org.springframework.web.context.ContextLoaderServlet;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.ProxoolDataSourceExt;
import com.sgepit.frame.util.DESUtil;
import com.sgepit.frame.util.JNDIUtil;

public class SpirngContext extends ContextLoaderServlet {

	private static final long serialVersionUID = 1L;

	private static String DS = null;

	public void init() throws ServletException {
		Constant.wact = WebApplicationContextUtils.getWebApplicationContext(getServletContext());
		Context ctx = null;
		try {
			InputStream is = DESUtil.class
					.getResourceAsStream("/system.properties");
			Properties p = new Properties();
			try {
				p.load(is);
				is.close();
			} catch (Exception e) {
			}
			DS = p.getProperty("JNDI");
			String matDeptId = p.getProperty("MAT_DEPT_ID");
			Constant.JndiName = DS;
			Constant.matDeptId = matDeptId;
			Constant.indexType =p.getProperty("indexType");
			ctx = new InitialContext();
			DataSource ds = new ProxoolDataSource(
					((ProxoolDataSourceExt) Constant.wact
							.getBean("dataSource1")).getAlias());
			Object obj = null;
			try {
				obj = ctx.lookup(DS);
			} catch (Exception e) {
			}
			try{
				if (obj != null) {
					ctx.rebind(DS, ds);
				} else {
					JNDIUtil.bind(ctx, DS, ds);
				}
			}catch(Exception ex){
				
			}
			Constant.DATASOURCE =ds;
			ctx.close();
		} catch (Exception e) {
			System.out.println(e.getMessage() + ",JNDI绑定出错!");
		}
	}

	public void destroy() {
		super.destroy();
	}

}