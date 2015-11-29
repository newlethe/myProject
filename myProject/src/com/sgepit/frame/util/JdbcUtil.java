package com.sgepit.frame.util;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.env.HibernateSessionFactory;
/**
 * 数据访问工具类,调用Hibernate的JdbcTemplate来进行sql语句的执行操作.
 *
 */
public class JdbcUtil {

	private static JdbcTemplate jt = new JdbcTemplate(HibernateSessionFactory
			.getConnectionFactory());
/**
 * 获取JdbcTemplate对象.
 * @return 
 */
	public static JdbcTemplate getJdbcTemplate() {
		return jt;
	}
/**
 * 使用进行JdbcTemplate进行sql查询
 * @param sql 指定的sql语句
 * @return 结果List,List中的每一条记录是一个Map对象，对应数据库中某一行；该Map中的每一项对应数据库行中的某一列值。
 */
	public static List query(String sql) {
		return jt.queryForList(sql);
	}
/**
 * 使用进行JdbcTemplate进行sql更新和插入操作
 * @param sql 指定的sql语句
 * @return 
 */
	public static int update(String sql) {
		return jt.update(sql);
	}
/**
 * 使用进行JdbcTemplate进行其他非查询及更新的sql操作
 * @param sql 指定的sql语句
 */
	public static void execute(String sql) {
		jt.execute(sql);
	}

}

