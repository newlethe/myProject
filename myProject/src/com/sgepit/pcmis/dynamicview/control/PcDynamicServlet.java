package com.sgepit.pcmis.dynamicview.control;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONSerializer;
import net.sf.json.JsonConfig;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.util.JsonDateProcessor;
import com.sgepit.pcmis.dynamicview.service.PcDynamicDataService;

public class PcDynamicServlet extends HttpServlet {
	private static final Log log = LogFactory.getLog(com.sgepit.pcmis.dynamicview.control.PcDynamicServlet.class);
	private PcDynamicDataService pcDynamicDataService;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		this.doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String key = req.getParameter("primaryKey");
		String beanName = req.getParameter("beanName");
		String uids = req.getParameter("uids");
		String pid = req.getParameter("pid");
		List list = pcDynamicDataService.getEntryBeanInfoByParams(key, pid,
				uids, beanName);
		outputString(resp, makeJsonDataForGrid(list));
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		pcDynamicDataService = (PcDynamicDataService) WebApplicationContextUtils
				.getRequiredWebApplicationContext(config.getServletContext())
				.getBean("pcDynamicDataService");
	}
    public void outputString(HttpServletResponse response, String str)
    throws IOException
{
    response.setCharacterEncoding("utf-8");
    PrintWriter out = response.getWriter();
    log.debug(str);
    out.println(str);
    out.flush();
    out.close();
}
	public String makeJsonDataForGrid(List list) {
		int size = list.size();
		if (list != null
				&& list.size() > 0
				&& list.get(list.size() - 1).getClass().getName().equals(
						"java.lang.Integer")) {
			size = ((Integer) list.get(list.size() - 1)).intValue();
			list.remove(list.size() - 1);
		}
		JsonConfig jsonConfig = new JsonConfig();
		Map classMap = new HashMap();
		classMap.put("*", java.util.HashMap.class);
		jsonConfig.setClassMap(classMap);
		jsonConfig.registerJsonValueProcessor(java.sql.Timestamp.class,
				new JsonDateProcessor());
		jsonConfig.registerJsonValueProcessor(java.util.Date.class,
				new JsonDateProcessor());
		StringBuffer s = new StringBuffer("{\"totalCount\":\"");
		log.debug(JSONSerializer.toJSON(list, jsonConfig).toString());
		s.append(size);
		s.append("\",\"topics\":");
		s.append(JSONSerializer.toJSON(list, jsonConfig).toString().toString());
		s.append("}");
		return s.toString();
	}
}
