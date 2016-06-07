/*
 * Project: ExtDo
 * 
 * Copyright(c) 2008 www.extdo.com
 * All rights reserved.
 */

package com.sgepit.pmis.gantt.Edo.sql;

import java.io.Reader;
import java.nio.charset.Charset;

import com.ibatis.common.resources.Resources;
import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapClientBuilder;

public class DaoFactory {

	private static SqlMapClient sqlMapper;

	static {
		try {
			String resource = "sqlmapconfig.xml";
			Resources.setCharset(Charset.forName("UTF-8"));
			Reader reader = Resources.getResourceAsReader(resource);
			sqlMapper = SqlMapClientBuilder.buildSqlMapClient(reader);
			reader.close();
		} catch (Exception e) {
			throw new RuntimeException("初始化DaoFactory错误. 异常:" + e);
		}
	}

	public static SqlMapClient getDao() {
		return sqlMapper;
	}

}
