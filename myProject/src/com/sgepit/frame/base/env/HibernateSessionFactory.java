package com.sgepit.frame.base.env;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.sgepit.frame.base.Constant;

public class HibernateSessionFactory {

	private static SessionFactory sessionFactory;

	private static DataSource connectionFactory;

	private static Logger log = Logger.getLogger(HibernateSessionFactory.class);

	public static Session getSession() throws HibernateException {
		if (sessionFactory == null) {
			rebuildSessionFactory();
		}
		return sessionFactory.openSession();
	}

	public static Connection getConnection() throws SQLException {
		if (connectionFactory == null) {
			rebuildSessionFactory();
		}
		return connectionFactory.getConnection();
	}

	public static void rebuildSessionFactory() {

		try {
			connectionFactory = (DataSource) Constant.wact
					.getBean("dataSource1");
		} catch (Exception e) {
			log.error("%%%% Error Creating ConnectionFactory %%%%");
			e.printStackTrace();
		}
		try {
			sessionFactory = (SessionFactory) Constant.wact
					.getBean("sessionFactory1");
		} catch (Exception e) {
			log.error("%%%% Error Creating SessionFactory %%%%");
			e.printStackTrace();
		}
	}

	public static SessionFactory getSessionFactory() {
		if (sessionFactory == null) {
			rebuildSessionFactory();
		}
		return sessionFactory;
	}

	public static DataSource getConnectionFactory() {
		if (connectionFactory == null) {
			rebuildSessionFactory();
		}
		return connectionFactory;
	}

}